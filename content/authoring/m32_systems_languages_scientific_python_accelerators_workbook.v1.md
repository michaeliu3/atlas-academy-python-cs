# M32 candidate workbook — Systems Languages, Scientific Python & Accelerators

**Authoring-only private study pack.** This is original draft material for
instructor-led study in the designated Codex chats. It deliberately lives
outside `content/modules` and the reader manifest; private study does not open
a portal route, grant Core credit, or establish a source-map decision, contract
review, accessibility review, release, or learner mastery.

**Knowledge arc:** Systems reasoning → formal methods, machine learning, and
reliable AI systems

**Canonical academic prerequisites:** M12 API contracts and dependency
boundaries; M17 architecture and execution; M19 concurrency and parallelism;
M24 CPython performance and memory; M28 linear algebra and numerical
stability; and M31 optimization and information. These remain required
learning bridges for private instructor-led study. M31 and M32 being
authoring-only means that no portal reader route, Core credit, or release claim
exists; it does not make their academic prerequisites optional.

**Primary outcome:** Given a small scientific-computing or accelerator claim,
you can trace the public contract, representation, ownership, execution
history, numerical assumptions, and measurement boundary; read a short
Python/native or array/autodiff fragment without inventing its behavior; and
produce a bounded evidence packet that distinguishes an observation from a
portable performance, correctness, or architectural conclusion.

This is not a promise of expertise in C/C++ extensions, CUDA, HIP, JAX,
PyTorch, compilers, GPU administration, or one vendor's tools. It is an
advanced foundation for reading, reviewing, debugging, and directing
scientific and AI-era systems work. No GPU, framework installation, driver
change, cloud account, or arbitrary code execution is required for this
workbook.

---

## How this module stays connected

### The working invariant

> **A systems or performance claim is credible only when its public contract,
> data representation, ownership history, execution boundary, numerical
> policy, measured evidence, alternative explanation, and non-claim are
> visible.**

An elegant one-line array expression or an AI-generated kernel suggestion is
not a complete explanation. It is a candidate for inspection.

~~~mermaid
%% atlas-diagram-id: m32-systems-evidence-route
%% atlas-diagram-title: The M32 systems evidence route
%% atlas-diagram-alt: A scientific question first becomes a public interface and data contract. The contract exposes array representation and ownership, which expose a host-to-device execution history. Numerical and autodiff assumptions plus a bounded measurement protocol lead only to an observed result, alternative explanations, and a limited recommendation.
flowchart LR
  Q["Scientific question + semantic oracle"] --> B["Python/native boundary + public contract"]
  B --> R["shape, dtype, strides, alias/copy, ownership"]
  R --> E["host request, transfer, dispatch, kernel, synchronization"]
  E --> N["numerics, autodiff, compiler, and environment assumptions"]
  N --> M["bounded measurement + raw observation"]
  M --> C["alternatives, non-claim, limited next action"]
~~~

**Text alternative:** Start with a scientific question and a way to tell
whether an output is semantically acceptable. State the public interface and
data contract before discussing speed. Then expose shape, dtype, layout, copy
state, and ownership; trace requests, transfers, dispatch, work, and waits;
name numerical, autodiff, compiler, and environment assumptions; and record a
bounded measurement. The final result is an observation plus alternatives and
a limited next action—not an automatic recommendation.

### What each earlier module contributes

| Earlier module | Reused here | M32 adds |
| --- | --- | --- |
| M12 | public promises, error boundaries, ownership, dependency direction | a map spanning Python orchestration, array representation, native kernel, and output validation |
| M17 | execution stacks, memory hierarchy, locality, layer-specific explanation | a host/request/transfer/compute/observation trace |
| M19 | histories, synchronization, ownership, nondeterminism | legal buffer reuse points and one failure probe |
| M24 | profiler limits, allocation/lifetime reasoning, controlled comparisons | a reproducible benchmark card and an explicit nonportable-claim label |
| M28 | shapes, strides, conditioning, floating-point representation | a layout-and-numerics note tied to an actual operation |
| M31 | objective, gradients, finite traces, convergence boundaries | an autodiff execution trace and bounded gradient check |

M33 remains the planned forward module. M35 and M36 may later consume this
module's artifact as an academic bridge, but that planning relationship is not
a route or an unlock.

### Evidence labels

| Label | It can establish | It cannot establish |
| --- | --- | --- |
| **[INTERFACE CONTRACT]** | A named public input/output, error, version, and ownership promise. | That a native implementation is safe, fast, portable, or zero-copy. |
| **[REPRESENTATION FACT]** | The declared shape, dtype, strides, layout, alias/copy, and device state. | The best algorithm, performance, or numerical suitability by itself. |
| **[EXECUTION TRACE]** | A stated sequence of enqueue, transfer, compute, wait, and observation events. | That two stages overlap or that a trace holds on another backend. |
| **[NUMERICAL CHECK]** | A bounded comparison under named dtypes, points, tolerances, and oracles. | Objective validity, convergence, generalization, or stable behavior everywhere. |
| **[MEASUREMENT]** | An observed comparison under one protocol and environment. | A mechanism, causal bottleneck, or universal speedup. |
| **[AI PROPOSAL]** | A candidate trace, derivation, benchmark design, or code review. | Authority, correctness, hardware access, or a reason to skip inspection. |

### Claim/source labels

Compact labels such as `M32-C03 -> S32-03–S32-04` point to the exact claim and
source route in the [M32 source research dossier](../source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md).
They do not make a library call, a local observation, or a framework result
portable: the stated assumptions and non-claim still control the conclusion.

### Code labels

- A `text` fence is **language-neutral pseudocode** for reading a contract or
  trace. It is intentionally not directly runnable Python.
- A `python` fence is a syntax-valid compact Python fragment; its surrounding
  exercise still declares the inputs, environment, and limited claim.
- A `c` fence is an original, deliberately flawed C-API reading sketch. Read
  its contract and error paths; do not compile or run it as a lab.
- The M32 NumPy observation names an exact package version and has a focused
  test. It remains one CPU-only observation, not a benchmark or platform model.

### The systems evidence card

Keep this compact card beside every trace or timing result.

~~~text
Question and decision owner:
Semantic oracle / acceptable output invariant:
Public inputs, outputs, errors, version, and ownership contract:
Shape, axes, dtype, strides/layout, alias/copy, and residency:
Host request -> transfer -> queue/stream -> work -> synchronization -> observation:
Framework/runtime/backend, build, compiler, driver, OS, and device facts:
Numerical policy, tolerance, conditioning or overflow concern:
Warm-up, timing boundary, repeats, raw observations, and summary statistic:
Alternative explanations, counterexample/falsifier, and explicit non-claim:
Limited next action and who may decide it:
~~~

---

## Prerequisite retrieval

Answer briefly before consulting notes. These are repair directions, not grades.

1. Draw the narrowest public interface between a Python orchestration layer and
   a numerical-kernel layer. Which ownership and error facts must cross it?
2. Trace one array operation from a Python request through memory access. What
   cannot be concluded until a measurement has named its timing boundary?
3. Two arrays have equal shape. Give one reason they can still differ in
   legal mutation, memory traversal, cost, or numerical behavior.
4. A host launches work that may execute later. When is it legal to reuse the
   source or destination buffer?
5. A finite-difference check agrees with an autodiff result at one point. What
   has that check *not* validated?

If 1 is fragile, repair with M12. If 2 is fragile, revisit M17. If 3 is
fragile, use M24 and M28. If 4 is fragile, revisit M19. If 5 is fragile,
bridge through M31 before continuing. Do not begin by installing a framework.

---

## Session 1 — Map responsibility before optimizing a boundary

**Launch:** With the Study Partner, map the public input, output, version, ownership, and error promises before following the lower-level code.

### Core question

**What public promise exists between Python orchestration and lower-level
work?**

**Claim/source trace:** `M32-C01–M32-C02 -> S32-01–S32-02` — public contract,
buffer/layout, lifetime, and version facts must be named before a no-copy claim.

The first systems mistake is to start with a tool label: "C extension,"
"vectorization," "GPU," or "compiler." Start instead with a boundary:
who calls whom, which object is passed, what may mutate it, what errors are
visible, and which implementation/version is in scope.

For a small original teaching fixture, imagine a Python function that sends a
two-dimensional batch to a lower-level numerical routine:

~~~text
def summarize_batch(batch):
    prepared = prepare_for_kernel(batch)
    result = kernel_summary(prepared)
    return validate_summary(result)
~~~

This is not enough to know whether 'prepare_for_kernel' copied data, accepted a
view, changed dtype, released a buffer, queued asynchronous work, or raised a
recoverable error. The names are a public *shape* of a system, not evidence of
the hidden behavior.

### Build the boundary in this order

1. **Semantic promise.** Define what an acceptable summary means before
   choosing its array representation. A numeric output needs an invariant,
   units, and tolerance.
2. **Public data contract.** Name rank, axes, shape rule, dtype, layout or
   contiguity request, read/write permission, ownership, and lifetime.
3. **Failure contract.** Specify invalid shapes, unsupported dtypes, device
   absence, overflow, cancellation, and release failure separately from a
   generic "kernel failed" message.
4. **Implementation boundary.** State interpreter implementation/version,
   extension or framework API, ABI/build target if relevant, and what is
   deliberately private.
5. **Non-claim.** A narrow contract does not establish no-copy behavior,
   portability to every Python implementation, numerical correctness, or
   performance.

### Prediction before reveal

Suppose the caller passes a strided view:

~~~text
window = samples[:, ::2]
answer = summarize_batch(window)
~~~

Before reading any implementation, predict which facts must be inspected
before claiming a no-copy handoff:

- shape alone;
- shape plus dtype;
- shape, dtype, strides/layout, requested contiguity, writable/readonly
  state, lifetime, and consumer contract;
- the fact that the result looked correct once.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** the third answer. Shape and dtype are necessary descriptions but
do not say whether the consumer can accept the view or whether preparation
materializes a contiguous copy. A correct-looking output does not prove the
ownership or transfer path.

</details>

### Code-reading lab — a contract hidden by a helpful helper

~~~text
def prepare_for_kernel(batch):
    if batch.ndim != 2:
        raise ValueError("expected a rank-2 batch")
    return make_contiguous_float32(batch)

def summarize_batch(batch):
    prepared = prepare_for_kernel(batch)
    return kernel_summary(prepared)
~~~

Read this before changing it.

| Visible fact | What you may say | What remains unknown |
| --- | --- | --- |
| rank check | The public function rejects a non-rank-2 input. | Axis meanings, accepted shape range, units, and semantic validity. |
| named conversion | A preparation step may require contiguous float32 input downstream. | Whether it copied, how much memory it used, or whether float32 is appropriate. |
| result call | A lower-level function is invoked on the prepared object. | Its error, ownership, synchronization, ABI, and device contract. |

Write the smallest missing contract sentence: "The caller retains/may not
retain ______ until ______; this routine returns/raises ______ under ______."

### Debugging probe — no copy is not no responsibility

A teammate changes 'make_contiguous_float32' to a lower-level buffer handoff
and removes the temporary object immediately after launch. Name two independent
questions:

1. Did a conversion or copy still occur because the view had an incompatible
   layout or dtype?
2. If work may continue after the call returns, who keeps the source, staging,
   and result storage alive until the named synchronization point?

Do not repair this by guessing a framework behavior. Add an ownership/lifetime
field to the contract and obtain evidence from the actual API and trace.

### Bounded reference fixture — layout before a no-copy claim

Read [`lib/m32-systems-evidence-fixture.js`](../../lib/m32-systems-evidence-fixture.js) as a local code-reading card.
Before calling `m32LayoutHandoffTrace()`, predict whether its base and
reversed-column cards have the same shape, the same strides, and the same
eligibility for a declared positive-contiguous consumer. Inspect the two
logical-to-storage reads and state the narrow conclusion about the handoff.

The card is not an actual array-library, buffer-protocol, or GPU trace. It
does not tell you what a real `prepare_for_kernel` implementation copies or
accepts; it shows the metadata a review must still name.

### Native code-reading card — a buffer descriptor is not a flat float array

This is a **deliberately flawed original C-API sketch** for reading—not a
compiled extension, recipe, or invitation to run native code. It requests a
formatted strided buffer, then hides two contract bugs.

~~~c
#include <Python.h>
#include <string.h>

int inspect_rank2_float32(PyObject *source) {
    Py_buffer view = {0};
    if (PyObject_GetBuffer(source, &view, PyBUF_FORMAT | PyBUF_STRIDES) < 0) {
        return -1;
    }
    if (view.ndim != 2 || view.itemsize != sizeof(float) ||
        strcmp(view.format, "f") != 0) {
        return -1;  /* suspicious: a successful acquisition was not released */
    }

    float observed_total = 0.0f;
    float *values = (float *)view.buf;
    for (Py_ssize_t row = 0; row < view.shape[0]; ++row) {
        for (Py_ssize_t column = 0; column < view.shape[1]; ++column) {
            observed_total += values[row * view.shape[1] + column];  /* suspicious */
        }
    }
    (void)observed_total;  /* traversal is the only purpose of this inspection sketch */
    PyBuffer_Release(&view);
    return 0;  /* inspection sketch: no public result contract is claimed */
}
~~~

**Text equivalent:** after a successful request, the sketch can reject an
unsupported descriptor without releasing it. Its indexing expression treats
the buffer as a C-contiguous float array even though the request permits
arbitrary strides, including a negative-stride view. The sketch is therefore a
review target, not a valid no-copy implementation.

**Predict before reveal.** Mark the two suspicious lines and choose a repair
direction before reading on:

- A. Either make a `PyBUF_FORMAT | PyBUF_C_CONTIGUOUS` **C-contiguous request**
  (and handle its possible failure while preserving the format-dependent
  contract), or acquire a strided view and verify it with
  `PyBuffer_IsContiguous(&view, 'C')` before a flat-pointer walk; ensure every
  successful acquisition has one paired release on every exit path.
- B. Treat shape as enough evidence that the flat-pointer walk is valid.
- C. Remove `PyBuffer_Release` because the caller still owns `source`.
- D. Convert the code to Python and infer the native contract from one result.

<details>
<summary>Reveal the boundary repair after writing your prediction.</summary>

**Reveal:** A. A consumer that needs `view.format` may ask
`PyObject_GetBuffer` for `PyBUF_FORMAT | PyBUF_C_CONTIGUOUS`; that request can
fail. Or it may acquire the strided formatted view and call
`PyBuffer_IsContiguous(&view, 'C')` before flat-pointer arithmetic. Otherwise
it must retain the strided contract and compute addresses from the declared
strides. Those are different consumer promises. After
`PyObject_GetBuffer` succeeds, every later return path must preserve the single
paired `PyBuffer_Release` duty. Real code must also define its exact format
acceptance, rank/shape policy, read versus write permission, overflow checks,
and error translation under its pinned Python/build target.

For a rank-2 strided contract, the byte-address idea is:

~~~c
char *address = (char *)view.buf + row * view.strides[0] + column * view.strides[1];
~~~

`view.buf` is the **logical start** of the described view, not necessarily the
start of the physical allocation. With a negative stride, it can point at the
**end of the physical storage**. That is why treating it as a flat positive
row-major `float *` is a separate contiguous-consumer promise. A real consumer
must still state its exact format, item-size, alignment, and dereference rules.

</details>

### Debugging task — repair the claim, not just the line

For this sketch, write a review note with three columns: observed source fact,
missing contract fact, and safe next action. Include the negative-stride view
as the smallest counterexample to the flat traversal. Then change one premise:
suppose the consumer writes instead of reads. Which request and permission fact
must be rechecked before the implementation can even discuss mutation?

The point is not to memorize C API flags. It is to make the boundary visible:
format, item size, rank, shape, strides, contiguity, readonly/writable state,
and paired release belong in the same review sentence.

### Tool choice is a contract choice, not a speed promise

An AI assistant proposes: “Use Cython or Numba; it will make this no-copy and
fast.” Do not accept or reject that sentence by tool name. Compare three
possible **reading targets** first:

| Route | Contract evidence you would need before a narrow claim | What the route does **not** prove by itself |
| --- | --- | --- |
| A CPython C-API buffer consumer | Requested buffer flags, exact format/rank/shape/stride/read-write rules, every successful-acquisition release path, interpreter/build target, and the semantic oracle. | That the caller avoided a conversion, that the consumer is portable, numerically correct, or fast. |
| A Cython typed-memoryview boundary | The declared element type/dimensions/layout requirement, read-only or writable rule, compiler and generated-extension build scope, and the behavior for an incompatible view. | That a typed signature preserves the caller's storage, avoids materialization, or transfers to another Python/runtime environment unchanged. |
| A Numba-compiled CPU function | The supported Python/NumPy operations, compilation mode/version, dtype and numerical-order assumptions, real workload, semantic oracle, and completed measurement protocol. | That compilation preserves every Python behavior, that a vectorized expression is inferior, or that one timing transfers to another CPU, library, or backend. |

Read the [Cython typed-memoryview guide](https://cython.readthedocs.io/en/3.1.x/src/userguide/memoryviews.html)
and [Numba performance guide](https://numba.readthedocs.io/en/stable/user/performance-tips.html)
only to check the named contracts. They are not build recipes or benchmark
authority. Pick one route, write the smallest falsifiable claim it might
support, and then write the first counterexample or measurement that could
defeat that claim. In particular, ask an AI proposal where copies, layout
rejections, floating-point reordering, compilation, and completed work are
observed rather than inferred.

### Output: Boundary Contract Map

Create a **Boundary Contract Map** for one bounded, non-consequential
computation. Include:

- semantic oracle, units, public input/output, errors, and version scope;
- rank/axes/shape/dtype/layout/alias/copy/residency fields;
- format, item size, rank, shape, strides, contiguity, readonly/writable state,
  and paired release for any buffer-consumer boundary;
- caller, exporter, consumer, and result owner at each boundary;
- one intentionally private implementation detail;
- one adversarial input such as a negative-stride view, readonly buffer,
  unsupported dtype, or mismatched axis;
- a sentence beginning "This boundary does not establish ...".

### Transfer task

An AI proposes: "Use the stable ABI and the result will work everywhere."
Write a constructive review response that separates:

1. an interpreter/API compatibility claim,
2. a build/ABI/platform claim,
3. a data-contract claim, and
4. a performance or correctness claim.

Ask for the narrowest missing evidence rather than accepting or rejecting the
proposal by brand name.

---

## Session 2 — Trace work before timing it

**Launch:** Sketch request → transfer → queue or stream → work → synchronization → observation, then mark the first event that makes the result readable.

### Core question

**Where do data and work actually move between a host request and a visible
result?**

**Claim/source trace:** `M32-C05–M32-C07 -> S32-08–S32-10, S32-12` — dispatch,
transfer, completion, and timing boundaries depend on one named backend.

An asynchronous request is not the same event as completed work. A host can
prepare input, arrange transfer, enqueue work, continue with another task, and
observe a result later. On a CPU-only path, queues and native thread pools can
create a similar distinction. The exact events belong to the concrete
runtime/backend, not to the word "accelerated."

~~~mermaid
%% atlas-diagram-id: m32-request-to-observation-trace
%% atlas-diagram-title: A generic request-to-observation trace
%% atlas-diagram-alt: The host prepares an input and records its residency. It may transfer or stage the input, enqueue work in a named queue or stream, and later use a synchronization or observation operation before reading a result. Timing only the enqueue segment measures neither transfer nor completed work.
sequenceDiagram
  participant H as Host / Python
  participant Q as Named queue or stream
  participant D as Native or device worker
  H->>H: prepare input + record residency
  H->>Q: request transfer or submit work
  Q->>D: execute when dependencies allow
  H->>H: continue or start a clock
  H->>Q: wait, event query, or result observation
  D-->>Q: completion signal
  Q-->>H: result becomes observable
~~~

**Text alternative:** The host prepares input and records where it currently
lives. It submits transfer or work to a named queue or stream. A worker
executes when dependencies allow. The host may continue. A later wait, event
query, or result observation creates a boundary at which completion can be
observed. Timing only submission does not measure all the requested work.

### First principle — an event needs a clock and a boundary

A time reading answers only "how long elapsed between these two events on this
clock?" It does not automatically answer "how long did the computation take?"
For a performance statement, specify:

- which work counts: preparation, transfer, compile, dispatch, compute,
  synchronization, output conversion, or all of them;
- the clock or event facility and its domain;
- the readiness boundary: host wait, event completion, output observation, or
  another named operation;
- warm-up/compilation policy, repeats, input fixtures, and semantic oracle;
- the environment under which the observation was made.

### Cost prediction card — name the work before comparing paths

Before timing anything, write a hypothesis with visible terms:

\[
T_{\mathrm{accelerator}} = T_{\mathrm{prepare}} + T_{\mathrm{transfer}} +
T_{\mathrm{queue/launch}} + T_{\mathrm{execute}} + T_{\mathrm{ready/return}}.
\]

Compare it with a named CPU baseline such as
`T_cpu = preparation + CPU execution + result conversion`, not with the word
"CPU." The terms may overlap or be excluded only when the protocol says how.
This is a reasoning scaffold, not a universal performance model.

| Changed premise | Prediction to make before measurement | One observation that could falsify it |
| --- | --- | --- |
| tiny workload, host-resident input, immediate host read | transfer, launch, and readiness may dominate useful device work | a completed-work protocol that includes those terms and still shows a lower end-to-end latency |
| larger arithmetic-intensive workload with suitable locality | useful execution may dominate fixed overheads | raw completed-work timings under the same oracle, layout, warm-up, and environment show no such crossover |
| strided or repeatedly converted input | layout/conversion may dominate even if nominal arithmetic grows | a controlled layout/residency change moves the cost in a different direction than predicted |

State the useful-work unit, input size/layout, arithmetic-intensity proxy, and
one competing explanation. A favorable prediction is not a speedup claim; a
completed, oracle-checked observation is still only a scoped observation.

### Optional backend reading lens — PyTorch CUDA, not a GPU lab

Use this lens only when you deliberately choose **PyTorch CUDA semantics** as
the named backend to read. It is a vocabulary and code-reading bridge; it does
not require PyTorch, a GPU, a timing run, or a portability claim. The generic
trace above remains the required CPU/text fallback.

| Generic trace field | PyTorch CUDA concept to inspect in the official documentation | Question the lens still leaves open |
| --- | --- | --- |
| submit | A CUDA operation may return control to the host before device work has completed. | Which operation, input residency, PyTorch/CUDA/driver version, and stream were actually used? |
| named queue | The current/default or an explicitly named CUDA stream orders work in that stream. | Which dependencies cross streams, and what prior work is already queued? |
| readiness boundary | A documented synchronization operation can define a host-visible wait boundary. | Does the chosen wait include transfer, warm-up, or unrelated queued work? |
| storage/lifetime | A tensor, its device storage, and its stream usage have backend-specific lifetime rules. | Which object owns the storage until the last consumer, and which documented rule establishes that? |

Read the [PyTorch CUDA semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html)
page before using its terms. Record its access date and the exact runtime only
if you run a real observation. This table never establishes that a learner's
machine has CUDA, that a call overlaps work, or that a result is faster.

### Named execution contrast — JAX staged readiness and PyTorch CUDA streams

Do not turn "both use accelerators" into a common execution model. Read this
as a vocabulary contrast, not code to run:

| Question | JAX lens | PyTorch CUDA lens | Boundary that remains |
| --- | --- | --- | --- |
| host return | JAX documents asynchronous dispatch; a value may be pending until a named readiness operation such as `block_until_ready()`. | A CUDA operation can return before queued device work completes. | Name the version, backend, device, input residency, and exact observation point. |
| work ordering | Staged transformations and the chosen backend determine what is compiled/dispatched. | Current/default or explicitly named streams order their own work. | Do not infer cross-stream dependencies, overlap, or compilation behavior from a generic trace. |
| precision premise | Default dtype/configuration can constrain representability. | Tensor dtype, accumulation behavior, and device path can change the numerical observation. | A lower-precision input versus higher-precision accumulation must be recorded with its tolerance and semantic oracle. |

Use the [JAX asynchronous-dispatch](https://docs.jax.dev/en/latest/async_dispatch.html)
and [PyTorch CUDA semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html)
pages as link-only documentation. The correct comparison begins by declaring
what is held fixed; it does not claim that the APIs, graphs, mutation rules, or
performance mechanisms are interchangeable.

### Prediction before reveal

Read this deliberately incomplete timing fragment:

~~~text
start = clock()
ticket = submit_work(input_array)
elapsed = clock() - start
return ticket, elapsed
~~~

Predict the strongest defensible sentence:

- A. 'elapsed' is the computation time.
- B. 'elapsed' proves the device is faster than the CPU.
- C. 'elapsed' measures the host-side interval around submission in this
  configuration; completed-work timing needs a named readiness boundary.
- D. The result is correct because submission succeeded.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** C. Even that statement needs the clock, runtime, input residency,
and submission semantics named. A later result conversion might implicitly
wait; it does not retroactively make the earlier clock a completed-work clock.

</details>

### Code-reading lab — make the missing event explicit

~~~text
warm_up(input_array)

start = clock()
ticket = submit_work(input_array)
wait_until_observable(ticket)
elapsed = clock() - start

result = read_result(ticket)
assert semantic_oracle(result)
~~~

This version has a clearer timing boundary, not a universal benchmark.
Inspect what still needs a record:

| Field | Why it remains necessary |
| --- | --- |
| input residency and transfer policy | A host-resident input may make transfer part of the measured path. |
| compilation/warm-up rule | A first invocation may include compilation or allocation not present later. |
| queue/stream and dependency history | Earlier work may delay this request or force a wait. |
| repeats and raw timings | One elapsed interval cannot characterize variation. |
| output oracle | A fast path with a different result is not a fair comparison. |

### Debugging probe — a hidden synchronization can invert the story

You see a chart showing "submit time: 0.2 ms" and "CPU time: 3 ms."
The notebook converts the device result to a host array outside the timed
section. State two alternative explanations before calling the route faster:

1. the expensive wait occurred during the conversion after the clock stopped;
2. input transfer, warm-up, or previous queued work was counted differently.

Propose a falsifiable next measurement rather than a new optimization.

### Output: Execution-Transfer Trace

Create an **Execution-Transfer Trace** using a CPU-only imagined queue or a
real documented backend only if you can record its exact environment. It must
show:

- input allocation/residency, staging/copy possibilities, submit event,
  queue/stream identity, work event, wait/event, result observation;
- owner of each buffer during each interval;
- clock/event boundary and which work is intentionally excluded;
- one predicted bottleneck and one observation that would falsify it;
- a non-claim: "This trace does not prove overlap, portability, or a speedup
  because ...".

### Transfer task

Suppose input is tiny, output is immediately read on the host, and the
accelerator requires staging and synchronization. Reason before measuring:
which terms could dominate, and why does that prediction not decide the
result? Connect this to M17's memory hierarchy rather than a device slogan.

---

## Session 3 — Treat array metadata as part of the algorithm

**Launch:** Predict whether the proposed handoff can be no-copy; name the shape, dtype, strides, aliasing, and semantic-oracle facts needed to check it.

### Core question

**What does an array operation mean once shape, dtype, layout, aliasing, and
measurement are made visible?**

**Claim/source trace:** `M32-C03–M32-C04 -> S32-03–S32-04` — array metadata,
alias/copy state, broadcasting semantics, and the semantic oracle precede any
cost claim.

An array is not just a rectangle of numbers. A useful representation account
includes homogeneous element type, shape and axes, indexing/strides/layout,
memory ownership or base relationship, writable state, device residency, and
library/backend semantics. Equal shapes can represent very different memory
paths and legal mutations.

### Representation before operation

Consider an original NumPy-like teaching fixture:

~~~text
base = make_array(shape=(3, 4), dtype="float32")
forward = base[:, :3]
reversed_columns = base[:, 3:0:-1]
~~~

Both views can have a two-dimensional shape, but they need not have the same
strides, contiguity, aliasing, or compatibility with a lower-level consumer.
Do not infer the exact behavior of a particular library from this pseudocode;
inspect its documented array contract and the actual values/metadata.

### Prediction before reveal

An AI says: "The operation is vectorized, so it will be faster and use less
memory."

Before seeing a profile, list the missing variables:

- input dimensions and axes;
- dtype and output precision;
- broadcasting result shape and intermediate allocations;
- view/copy and layout state;
- backend/native-thread configuration;
- semantic output oracle;
- measurement protocol and environment.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** vectorization can move loop work into an array library, but it can
also materialize a large temporary or take a path whose cost depends on
layout/backend. "Vectorized" is a description of an expression form, not a
measured speedup.

</details>

### Code-reading lab — compact expression, potentially large temporary

~~~text
differences = points[:, None, :] - centers[None, :, :]
squared_distance = (differences * differences).sum(axis=2)
~~~

Trace the shape symbolically. If 'points' has shape '(n, d)' and 'centers' has
shape '(k, d)', 'differences' has shape '(n, k, d)'. It may be a large
intermediate even though the final output has shape '(n, k)'.

Read four claims separately:

1. The expression describes pairwise coordinate differences under named axis
   meanings.
2. A library may apply broadcasting according to its documented semantics.
3. This fixture may allocate or otherwise realize an '(n, k, d)' intermediate.
4. No performance or memory conclusion follows until the actual backend,
   allocation behavior, input, and measurement are known.

### Bounded reference fixture — logical temporary before allocation claim

Before calling `m32PairwiseTemporaryCard({ n: 4, k: 3, d: 2 })`, predict the
logical intermediate and reduced-output shapes plus their element counts.
After inspection, explain why a larger logical temporary is a question for a
measurement card rather than evidence that a particular backend allocated it.

### CPU-only NumPy observation — inspect a real view, copy, and broadcast result

**Claim/source trace:** `M32-C03–M32-C04 -> S32-03–S32-04`. Read or run the
original [`m32_numpy_layout_observation.py`](../../scripts/m32_numpy_layout_observation.py)
with its focused test. It pins **NumPy 2.3.5** and inspects only one in-process,
CPU-only configuration:

- a `float32` base array has shape `(3, 4)`, byte strides `(16, 4)`, and is
  C-contiguous;
- its reversed-column view has the same shape, byte strides `(16, -4)`, is not
  C-contiguous, and shares an element with the base;
- `ascontiguousarray` yields a C-contiguous array that does not share an element
  with that simple reversed view; and
- the explicit `points[:, None, :] - centers[None, :, :]` result has shape
  `(2, 3, 2)`, `48` bytes, and reduces to the independently declared squared-
  distance oracle `[[1, 1, 2], [5, 13, 10]]`.

Before inspection, predict which pair shares an element and whether the
broadcast result has the final reduced shape. Then distinguish two questions:
`shares_memory` performs an exact overlap check (which can be expensive for
hard layouts); `may_share_memory` is a conservative possibility check and can
say “maybe” when no element overlaps. Neither settles a non-NumPy consumer's
conversion, lifetime, device, peak-memory, or performance behavior.

This is a fixed observation of named arrays, not a claim that broadcasting
always allocates, that a particular backend cannot fuse work, or that a layout
is faster.

### CPU-only stride-to-locality hypothesis card

Use the named CPU-only layout fixture before timing anything. For each declared
logical access order, draw the first four byte offsets and label the access
pattern—not a cache conclusion:

| Declared logical reads | Offset trace to draw | Initial pattern label | What is still required |
| --- | --- | --- | --- |
| `base[0, 0]` through `base[0, 3]` | `0, 4, 8, 12` from the base row start | contiguous, forward | a named workload and completed measurement before saying anything about performance |
| `reversed_columns[0, 0]` through `reversed_columns[0, 3]` | `12, 8, 4, 0` from the base row start | reversed, adjacent addresses | the same oracle, environment, and timing boundary before comparing it with the forward order |
| a declared `base[0, ::2]` traversal | fill in the offsets and signed step | strided | evidence that this stride, rather than a conversion or different work, explains any observation |
| a declared `2 x 2` tile/block traversal | write the coordinate and offset order yourself | blocked schedule | a named tile size, loop order, workload, and completed measurement |

Write one falsifiable sentence of the form: “For this named CPU, array,
workload, and access order, I hypothesize ___; I would withdraw it if ___.”
Keep “cache” and “faster” out of the conclusion until the semantic oracle,
warm-up, readiness boundary, and completed measurements are recorded. Even then,
the result is evidence for that named setup, not a general cache or backend
model.

### Reproducibility bridge — frozen observation versus moving documentation

Keep these two kinds of evidence separate:

| Item | What it can support | What it cannot replace |
| --- | --- | --- |
| This fixture | The named CPU-only arrays and checks under **NumPy 2.3.5**. | A claim about another NumPy release, backend, device, consumer, or allocation path. |
| [NumPy 2.3 copies/views](https://numpy.org/doc/2.3/user/basics.copies.html), [`shares_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.shares_memory.html), and [`may_share_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.may_share_memory.html) | The documented API vocabulary closest to the frozen fixture. | A rerun of the semantic oracle under the learner's environment. |
| [Current stable NumPy documentation](https://numpy.org/doc/stable/user/basics.copies.html), accessed 2026-08-01 | A route for checking later documentation language. | Evidence that this fixed 2.3.5 observation still holds unchanged. |

Before carrying a conclusion forward, record the runtime/library version and
rerun the named observation with its semantic oracle. Documentation helps
interpret an interface; it does not recreate the observed execution.

### SciPy / Array-API capability boundary

Scientific Python is not one backend promise. Read this tiny **capability
question**, not a compatibility tutorial:

```text
candidate = scipy_algorithm(array_input, named_options)
```

Before claiming that this can run on a chosen array/backend/device, write a
four-column note: the exact SciPy function and version, the input's array API
and device, the documented capability/support statement, and the fallback or
explicitly unsupported path. Then change the premise from a NumPy CPU array to
another backend/device. Which evidence must be rechecked instead of inferred
from the function name?

Use the [SciPy tutorial](https://docs.scipy.org/doc/scipy/tutorial/index.html)
and [Array API capability caveats](https://docs.scipy.org/doc/scipy/dev/api-dev/array_api.html)
as a vocabulary route. They do not establish that a particular algorithm,
version, device, or acceleration path is available on the learner's system.

### Numerical boundary — representation changes the claim

For a sum, a narrower dtype or reordered reduction can change rounding,
overflow/underflow behavior, and reproducibility. A useful comparison states a
reference, a tolerance, and what error means for this question:

~~~python
def relative_error(reference, candidate):
    scale = max(1.0, abs(reference))
    return abs(reference - candidate) / scale

assert relative_error(reference_value, candidate_value) <= tolerance
~~~

This verifies a narrow fixture/invariant only. It does not establish that
'float32' is universally adequate, that a compiled kernel is mathematically
correct, or that an optimization objective is valid.

### Debugging probe — the profiler is a clue, not an explanation

A profiler reports that one array call consumes most sampled time. Write three
competing hypotheses:

1. it is a true dominant computation for the stated input;
2. it includes allocation, transfer, synchronization, or conversion time;
3. it is downstream of an earlier layout, dtype, or batching choice.

Design one controlled comparison that could distinguish them. Change one
factor—layout, dtype, input scale, preallocation, or timing boundary—while
keeping the semantic oracle fixed.

### Output: Layout-Numerics Note

Produce a **Layout-Numerics Note** with:

- arrays, axes, shapes, dtype/precision, strides/layout, alias/copy state,
  mutation policy, backend, and semantic oracle;
- one layout or precision risk and one counterexample to "same shape means
  same cost";
- a conditioning, overflow, rounding, or tolerance observation.

### Output: Performance Evidence Card

Produce the linked **Performance Evidence Card** with:

- question and compared variants;
- one fair-comparison row for each pair: the shared semantic oracle or quality
  threshold, useful-work unit and workload shape, whether the metric is
  latency or throughput, included/excluded compile/transfer/synchronization
  work, and the baseline denominator; predict before measuring how a workload
  size change could alter that metric;
- versioned environment, hardware/OS/runtime/library header;
- input fixture, warm-up, clock boundary, repeats, raw observations, statistic;
- profiler interpretation as a hypothesis, not a root-cause claim;
- at least one alternative explanation and one next falsifier;
- an explicit non-claim.

### Transfer task

Sketch two possible implementations of pairwise distance: one materializes the
full '(n, k, d)' fixture; another blocks or reformulates it. Do not choose the
"faster" one. Instead, specify what must remain semantically equal, what
resource trade-off each makes, and which data would justify a choice.

---

## Session 4 — Draw ownership before claiming parallelism

**Launch:** Draw the producer, named dependency, last consumer, and legal-reuse point before making any overlap or throughput claim.

### Core question

**Who owns a buffer, and what ordering condition makes its reuse legal?**

**Claim/source trace:** `M32-C06 -> S32-02, S32-08–S32-10, S32-12` — an
ownership statement requires a named last consumer and dependency event.

Vectorization, parallel execution, and asynchrony are different ideas. A
vectorized operation can be synchronous; a host can queue asynchronous work
that uses one device; multiple workers can execute without safe ownership.
Correctness requires a history: who may read or write each resource, when a
dependency is satisfied, and when a result becomes observable.

### First principle — a buffer is a temporal contract

For every buffer, name:

- current owner and permitted readers/writers;
- producer completion or readiness event;
- consumer launch/dependency event;
- last use;
- legal reuse or release event;
- error/cancellation path and who cleans up.

The word "parallel" does not fill in any of these fields.

### Prediction before reveal

Read this abstract asynchronous fragment:

~~~text
slot = reserve_staging_buffer()
enqueue_copy(slot, host_batch, queue)
enqueue_kernel(slot, queue)
release_or_reuse(slot)
~~~

Before revealing a repair, choose the safest statement:

- A. Reuse is legal because the enqueue calls returned.
- B. Reuse is legal only after the named last consumer has completed or an
  equivalent documented ownership transfer makes it safe.
- C. Reuse is legal whenever the output looked correct once.
- D. Reuse is legal if the queue is called parallel.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** B. Enqueue often records a future dependency rather than completing
it. Exact ownership semantics vary, so a real repair must use the actual
runtime's documented event/wait/lease mechanism.

</details>

### Code-reading/debugging lab — an early reuse hazard

~~~text
slot = reserve_staging_buffer()
copy_ticket = enqueue_copy(slot, host_batch, stream_a)
kernel_ticket = enqueue_kernel(slot, depends_on=copy_ticket, stream_a)

return_slot_to_pool(slot)  # suspicious: is kernel_ticket the last use?
result = wait_and_read(kernel_ticket)
~~~

Do not conclude that this definitely races in every runtime. Instead, write
the questions a reviewer must answer:

1. Does enqueue retain a reference, borrow a buffer, or require caller-owned
   lifetime?
2. Does returning to the pool permit another writer before 'kernel_ticket'
   completes?
3. Which event represents the buffer's true last use?
4. What happens if copy or kernel submission fails between reservations?

One possible *design* is a lease whose release occurs after the last completed
consumer. The exact primitive remains a framework/runtime contract.

### A readable timeline

~~~text
time  ->   t0             t1               t2                 t3
host       owns H         submits copy      may do other work    reads result
slot       reserved       copy in flight    kernel reads slot    reusable only here
stream A                  copy event -----> kernel event ------> completion event
rule       no reuse       no conflicting write                  release after last use
~~~

**Text alternative:** At t0 the host reserves a staging slot. At t1 it submits
a copy. At t2 a kernel reads the slot after the copy event. Only after the
kernel's completion event at t3 is the slot reusable. A different runtime may
express the events differently, but it must make the dependency and last use
visible.

### Optional backend reading lens — a side stream still needs a lifetime story

This is a link-only reading lens for one named PyTorch/CUDA configuration, not
a GPU lab or a portable recipe. When a non-default consumer stream is involved,
a reviewer needs **both** a named dependency that protects its read and a
backend-specific storage-lifetime record that keeps the storage unavailable for
reuse until that consumer finishes. Launch order alone supplies neither fact.

~~~text
producer stream A -- named event / wait --> consumer stream B -- completion --> legal reuse
       \________________ storage remains live through B ____________________/
~~~

**Text reading:** Stream A produces or last writes the storage, then a named
dependency protects Stream B's later read. The storage remains retained through
that read; B's completion, not the host's launch order, establishes legal reuse.

For a pinned PyTorch version, `wait_stream` and `record_stream` are useful
documentation terms to inspect, not commands to copy into this course. A real
implementation must name its framework, backend, allocator, device, and error
path; this local reference fixture deliberately does not simulate side streams.

### Bounded reference fixture — event labels before reuse

Before calling `m32BufferReuseTimeline("after-enqueue")`, predict whether the
local card permits reuse. Then compare it with
`m32BufferReuseTimeline("after-kernel-complete")` and name the declared last
consumer. The result is a fixed event-label exercise, not an observation of a
real device queue, framework, overlap, or race.

### Failure probe

Change exactly one premise: intentionally make a test double return a staging
slot to its pool before a simulated consumer completion event. The expected
result is not "sometimes wrong output"; it is a designed evidence question:

- Which invariant should fail—lease state, ownership assertion, checksum, or
  event ordering?
- Which observation would distinguish early reuse from a numerical mismatch?
- How will the test avoid pretending that a CPU simulation proves a hardware
  stream bug?

### Output: Buffer-Ownership Timeline

Create a **Buffer-Ownership Timeline** and a **Failure Probe**. Include:

- resource name, owner, read/write permissions, queue/stream, dependencies,
  last use, reuse/release condition, and failure path;
- a visible event/order relation rather than a sentence using only "async";
- one illegal early-reuse scenario and the detector/invariant that should
  expose it;
- a bounded non-claim about race freedom, liveness, or overlap.

### Transfer task

An AI says: "The tasks run in separate streams, so they overlap." Ask it for a
corrected claim that names resource availability, independent dependencies,
host/device transfer path, synchronization, and an observation capable of
distinguishing queueing from overlap.

---

## Session 5 — Read autodiff as a program with a numerical contract

**Launch:** Write one scalar chain rule and a finite-difference check, then identify the dtype, device, and objective assumptions they do not validate.

### Core question

**What does an automatic derivative validate, and what remains a modeling,
systems, or numerical question?**

**Claim/source trace:** `M32-C08–M32-C09 -> S32-10–S32-12` — a derivative and
tolerance concern one implemented computation under a declared dtype/path.

Autodiff transforms or traces a declared computation under framework-specific
rules. It can produce a derivative of the implemented program on a named
domain. It does not select a good objective, prove that data was represented
correctly, validate a training decision, guarantee convergence, or make a
gradient stable under every dtype/device/mutation/control-flow choice.

### Start with a scalar claim

Use the small analytic teaching fixture:

\[
L(\theta) = (\theta x - y)^2,
\qquad
\frac{dL}{d\theta} = 2x(\theta x-y).
\]

For chosen scalar values of '\theta', 'x', and 'y', an autodiff result can be
compared with the analytic derivative and a finite-difference estimate:

\[
g_h(\theta)=\frac{L(\theta+h)-L(\theta-h)}{2h}.
\]

The comparison is valuable only with declared values, dtype, step 'h',
tolerance, domain, and source of randomness. Reducing 'h' forever can worsen
a finite-difference check through cancellation and representational limits.

### Prediction before reveal

Suppose a float32 implementation and an analytic gradient agree at one point
within a stated tolerance. Which statement is strongest?

- A. The objective is correct and the optimizer will converge.
- B. The framework derivative is a bounded match for this function, point,
  dtype, step/tolerance, and execution path; broader claims remain open.
- C. The system is numerically stable on every device.
- D. The model is ready for deployment.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** B. A good gradient check is evidence about a small computational
claim. It is not a replacement for M31's objective/constraint/convergence
reasoning.

</details>

### M31 Artifact Bridge — a gradient trace needs an objective contract

Bring the M31 **Objective/Constraint/Convergence Claim Sheet** into this
session. For every autodiff trace, copy or explicitly mark unavailable:

- the scalar or reduction objective and its units;
- domain, hard constraint, regularization, and representation assumptions;
- the one M31 conclusion being considered (for example, a local derivative
  match, a finite projected trace, or a rate bound) and its exact hypotheses;
- one conclusion a gradient check **cannot** supply: feasible optimality,
  convergence, generalization, or decision validity.

The trace may validate a derivative of the declared program. It cannot repair
an absent objective contract or import an unconstrained exact-gradient theorem
into a mixed-precision, projected, stochastic, or framework-specific path.

### Code-reading lab — separate framework semantics from the invariant

~~~text
def loss(theta, x, y):
    return (theta * x - y) ** 2

theta = scalar(1.0, dtype="float32")
value, automatic_grad = value_and_grad(loss)(theta, x, y)

h = scalar(1e-3, dtype="float32")
finite_difference = (loss(theta + h, x, y) - loss(theta - h, x, y)) / (2 * h)
assert close(automatic_grad, finite_difference, tolerance)
~~~

This is deliberately framework-neutral pseudocode. A review should still
record:

| Question | Why it matters |
| --- | --- |
| What does 'scalar' create and where does it live? | dtype, device, and array/tensor semantics affect the observation. |
| What does 'value_and_grad' differentiate? | Framework tracing, transforms, mutation, and control flow determine the program boundary. |
| Is the output scalar or is a cotangent/reduction declared? | A derivative request requires a well-defined mathematical target. |
| How is 'close' defined? | Absolute/relative tolerance, reference dtype, and scale change the conclusion. |
| What changes with a wider dtype or different 'h'? | Agreement should be interpreted through representational and truncation error. |

### Bounded reference fixture — manual reverse-mode scope

Before calling `m32ScalarReverseModeTrace({ theta: 1, x: 2, y: 1 })`, trace
the product, residual, loss, and derivative by hand. Compare the manual chain
rule with its central difference, then list two claims that agreement still
does not support. The card checks one scalar arithmetic trace; it does not
test framework autodiff, dtype/device behavior, or the choice of objective.

### Debugging probe — the gradient matches and the system is still wrong

Choose one of these failure modes and explain why gradient agreement may not
detect it:

- the loss uses the wrong target column;
- a silently copied or stale buffer feeds the computation;
- a reduction uses unintended axis/weights;
- a mixed-precision overflow changes a later update;
- the input is correct but the objective is an invalid proxy for the decision.

Repair the narrowest layer first. Do not label every failure "autodiff."

### Design task — framework comparisons require a declared difference

Some systems stage more computation before execution; others expose eager,
mutable tensor operations. Do not flatten them into "the same GPU framework."
Build a comparison table with these fields:

- what each program makes visible about mutation, aliasing, dispatch, and
  synchronization;
- what is held constant: fixture, semantic oracle, dtype, device, timing
  boundary;
- what is intentionally different;
- what a comparison may and may not conclude.

For a concrete changed premise, compare a lower-precision input with a
higher-precision accumulation path. Keep the function, reduction, data,
device, and semantic oracle visible. A changed result can arise from
representability, reduction order, overflow/underflow, or a different
execution path; it does not automatically identify the mechanism.

### Output: Autodiff-Execution Trace

Create an **Autodiff-Execution Trace** for the scalar fixture or another
bounded, non-consequential function. Include:

- objective, domain, scalar/reduction target, values/shapes/dtypes/devices,
  framework/runtime or pseudocode label, and mutation/control-flow boundary;
- the M31 objective/constraint/convergence claim sheet, or a precise reason it
  is unavailable for this task;
- analytic or independently reasoned gradient where available;
- finite-difference policy, step sweep or rationale, tolerance, and raw
  comparison;
- one failure mode that matching gradients cannot detect;
- a link back to M31: "A derivative match does not establish ...".

### Transfer task

An AI agent proposes changing a loss to obtain a larger gradient magnitude.
Ask it to explain the objective, units, constraint/regularization effect,
sampling/precision change, finite evidence, and non-claim. Decide whether the
right next action is code, a derivation, a numerical check, or a design review.

---

## Session 6 — Defend a bounded systems claim

**Launch:** Choose one sentence-sized systems claim and list its environment record, observation, limitation, and next falsifier before drafting the dossier.

### Core question

**Can you assemble an architecture and measurement record that a careful
reviewer can inspect without confusing it for a portable recommendation?**

**Claim/source trace:** `M32-C10–M32-C12 -> S32-12–S32-13` — reproducibility
and benchmark reports require a declared environment, semantic oracle, and
non-claim.

The point of the final dossier is not to produce the biggest benchmark or a
vendor-specific demo. It is to make a small systems claim inspectable from
question through observation. A CPU-only reference path, trace simulation, or
documented local environment is valid when labelled truthfully. Do not invent
hardware access, profiler output, or framework behavior.

### The evidence chain

~~~text
semantic question + output oracle
  -> boundary contract and representation note
  -> execution/ownership history
  -> numerical/autodiff check
  -> versioned experiment protocol
  -> raw observation or explicit "not measured"
  -> alternatives, counterexample, non-claim, next action
~~~

The chain is only as strong as its narrowest hidden field. A missing
synchronization boundary invalidates a completed-work timing claim; a missing
semantic oracle invalidates a performance comparison; a missing environment
record invalidates portability language.

### Prediction before reveal

A report says: "Our compiled GPU implementation is 20x faster."
Before asking for code, predict the first five evidence fields you would
request.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** a strong first request is:

1. the exact question and semantic output oracle;
2. variants, input shape/layout/dtype, and warm-up policy;
3. timing boundary, repeats, raw timing results, and summary statistic;
4. runtime/library/compiler/driver/OS/device environment;
5. transfers, synchronization, allocation, and alternative explanations.

The number alone does not tell you whether the comparison is fair, completed,
correct, or portable.

</details>

### Architecture-reading exercise

Read this deliberately compressed proposal:

~~~text
Python API -> array conversion -> async submit -> native kernel -> host result
~~~

Expand it into a reviewable architecture without adding imaginary detail:

| Layer | Must be named | Do not assume |
| --- | --- | --- |
| Python API | input/output, error, ownership, version contract | that a Python-level call tells you native execution cost |
| array conversion | shape/dtype/layout/alias/copy/residency | that conversion is zero-copy or numerically harmless |
| async submit | queue/stream, dependency, return meaning | that enqueue means completion or overlap |
| native kernel | backend/build/target and semantic role | that compilation proves speed, safety, or portability |
| host result | wait/observation, output oracle, result owner | that a successful result rules out stale or incorrect data |

### Reproduction capsule — retain evidence, redact identifiers

Attach one compact **Reproduction Capsule** to the dossier. It contains only
what a reviewer needs to reproduce or challenge the scoped claim:

```text
source revision or artifact hash:
package/runtime/backend versions:
OS, device/driver, compiler/ABI, and thread settings:
seed, determinism controls, data-order policy, and input identity/redaction:
shape/dtype/layout/residency plus semantic oracle:
warm-up, exact timing/readiness boundary, raw observations, and statistic:
known alternatives, non-claim, and privacy/redaction boundary:
```

Do not include credentials, raw private data, raw voice transcripts, or an
unredacted machine fingerprint in a learning note. A capsule makes a claim
auditable; it does not make it portable or repeatable on every environment.

### Adversarial reproduction-delta row

Attach one row beside the capsule that contrasts a control rerun with exactly
one deliberately changed premise. Keep the semantic oracle fixed; this is a
test of the portability boundary, not a search for a favorable result.

| Same-environment rerun | One changed variable | Fixed semantic oracle | Report both sides | Remaining non-portability claim |
| --- | --- | --- | --- | --- |
| `[control result under the recorded environment]` | `[library version, dtype, backend, data order, or synchronization policy]` | `[expected output and tolerance]` | `[what stayed the same; what changed; raw observation or design-only prediction]` | `[what cannot be generalized across environments]` |

If suitable hardware or a safe alternate environment is unavailable, the row
may be a design-only protocol: name the changed premise, the fixed oracle, the
observation that would count, and the claim that must remain withdrawn. Do not
turn equal same-seed results—or a single changed run—into a cross-release,
cross-platform, CPU/GPU, or backend reproducibility promise.

### Output: Scientific Python & Accelerators Dossier

Choose a bounded, non-consequential toy pipeline such as a table transform,
pairwise-distance calculation, or scalar gradient fixture. Deliver:

1. **Question and semantic oracle.** Define acceptable output, units, and
   limitation.
2. **Boundary Contract Map.** Reuse Session 1's interface, ownership, and
   failure fields.
3. **Representation and numerical note.** Show shapes, axes, dtype, layout,
   alias/copy state, tolerance, and one risk.
4. **Execution and ownership trace.** Reuse Sessions 2 and 4; identify the
   timing/observation boundary and legal buffer reuse point.
5. **Autodiff or independent numerical check.** Reuse Session 5, including
   its M31 objective/constraint/convergence bridge, or state why it is
   inapplicable.
6. **Experiment record and Reproduction Capsule.** Either provide a versioned,
   raw observation under a named environment or explicitly label the artifact a
   design-only protocol; include the compact, redacted capsule above.
7. **Limited recommendation.** State alternatives, counterexample/falsifier,
   non-claim, and human-controlled next action.

### Required evidence

Your dossier must expose the owner, semantic oracle, contract, representation,
execution history, numerical policy, environment, observation boundary,
alternative explanation, and non-claim. It must not:

- copy a vendor benchmark or documentation figure;
- claim device access, overlap, speedup, compatibility, or reproducibility
  without the exact supporting record;
- expose credentials, private data, raw voice transcripts, or unredacted
  environment identifiers in a learning note;
- treat a fast implementation as proof of a valid scientific objective or a
  safe real-world decision.

### Acceptance rubric

| Evidence | Strong evidence looks like | Repair prompt |
| --- | --- | --- |
| boundary | public promises, ownership, errors, and version scope are concrete | "Who owns this value after the call returns?" |
| representation | shape, axes, dtype, layout, alias/copy, and oracle are visible | "Which metadata field could change the computation?" |
| execution | submit, dependency, wait, and observation are separated | "Which event makes the result ready, and how do you know?" |
| numerics | tolerance/reference and one limitation are named | "What would this check miss at another scale or dtype?" |
| measurement | raw protocol/environment/alternatives are inspectable | "What did your clock exclude, and what else explains the result?" |
| transfer | next action is bounded and human-controlled | "What would falsify your recommendation?" |

This is a dossier rubric, not a score or a pass/fail certification.

---

## Confidence-aware diagnostic and spaced review

For each question, choose an answer and record confidence *before* reading the
explanation. Confidence is a routing signal for retrieval, not a grade.

### Q1 — A boundary is not a library name

A Python function calls a native routine with an array. What is the narrowest
additional evidence needed before calling the handoff no-copy?

- A. The function returned the right number once.
- B. Shape and dtype only.
- C. Exporter/consumer contract, layout/strides, requested contiguity,
  writable state, lifetime, and observed conversion behavior.
- D. A faster timing result.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Misconception repaired: correct output, shape, and a tool label
do not expose copy or ownership behavior.
</details>

### Q2 — Submission versus completion

A timer starts immediately before asynchronous submission and stops immediately
after. What did it most directly measure?

- A. Completed kernel execution.
- B. A host-side submission interval under a named configuration.
- C. End-to-end scientific throughput.
- D. Device-to-host transfer.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception repaired: an enqueue/dispatch event need not be a
completion event.
</details>

### Q3 — Equal shape

Two arrays have equal shape. Which claim is justified?

- A. They have equal strides and cost.
- B. They can be safely mutated independently.
- C. More layout, alias/copy, dtype, and backend evidence is needed.
- D. They are equally suitable for every kernel.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Misconception repaired: shape does not determine layout,
ownership, cost, or numerical behavior.
</details>

### Q4 — Vectorization

A compact broadcast expression produces a large temporary. What follows?

- A. Vectorization failed semantically.
- B. The expression may still be correct while its memory/performance story
  requires input, allocation, backend, and measurement evidence.
- C. A GPU always fixes the issue.
- D. The profiler will identify the unique cause.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception repaired: expression compactness is not a
resource claim.
</details>

### Q5 — Buffer reuse

When is a staging buffer safely returned to a pool?

- A. As soon as submission returns.
- B. When the source Python reference is deleted.
- C. After the documented last consumer/ownership condition is complete.
- D. Whenever work is called parallel.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Misconception repaired: an asynchronous history needs an
explicit last-use condition.
</details>

### Q6 — Autodiff

Automatic and finite-difference gradients agree at one float32 point. What is
the best conclusion?

- A. The loss and optimizer are globally correct.
- B. A bounded derivative check passed for stated values, dtype, step, and
  tolerance.
- C. Every device will give the same result.
- D. The data pipeline has no stale values.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception repaired: a derivative check is not model,
systems, or convergence validation.
</details>

### Q7 — Reproducibility

Two runs use the same seed. What remains necessary for a reproducibility
claim?

- A. Nothing; a seed fixes all variation.
- B. Runtime/library/device/driver/build/data-order/determinism settings and
  the bounded output/measurement claim.
- C. Only a screenshot of the result.
- D. A faster implementation.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception repaired: a seed is one control, not an
environment identity.
</details>

### Q8 — Performance number

Which statement is strongest after one timed run?

- A. The optimized design is universally faster.
- B. The result proves the bottleneck.
- C. One observation occurred under a stated protocol; repeats, raw records,
  semantic equivalence, and alternatives remain necessary.
- D. The compiler chose the best algorithm.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Misconception repaired: a measurement is an observation, not a
mechanism or recommendation.
</details>

### Compact repair key

If Q1/Q3 is fragile, return to the Boundary Contract Map and add the missing
metadata. If Q2/Q5 is fragile, redraw the execution/ownership history with a
named readiness event. If Q4/Q8 is fragile, rebuild the Performance Evidence
Card before optimizing. If Q6 is fragile, return to M31's distinction between
an objective, derivative, finite trace, and warranted claim. If Q7 is fragile,
make an environment record rather than adding more random seeds.

### Retrieval queue

Retrieve the invariant and one artifact after 1, 3, 7, 14, and 30 days.

- Day 1: redraw a boundary map from memory.
- Day 3: distinguish submission time from completion-aware time.
- Day 7: change stride/layout or dtype in a fixture and name the new evidence
  requirement.
- Day 14: inject an early buffer reuse or stale-result premise and repair the
  ownership history.
- Day 30: defend one performance claim using a counterexample, a non-claim,
  and a next falsifier.

Do not erase an earlier answer. Add the changed premise and the repaired
reasoning to the evidence card.

---

## TA clinic and Study Partner routine

### Teaching Assistant — M32 systems evidence clinic

The Teaching Assistant leads a 25–35 minute first-principles clinic and then a
supportive oral defense. It begins from the learner's Boundary Contract Map,
Execution-Transfer Trace, and Dossier—not a score.

~~~text
You are Atlas Academy's M32 Teaching Assistant. Conduct a constructive,
non-grading systems-reasoning discussion from the learner's evidence packet.
Ask for: one public contract and ownership boundary; one shape/dtype/layout
fact; one execution or synchronization event; one numerical/autodiff
assumption; and one observation whose scope the learner can limit. Ask for a
prediction before revealing a correction. Change one premise at a time:
negative stride, hidden copy, asynchronous wait, early buffer reuse, dtype
change, warm-up policy, or changed device/runtime. Use the visible chat as an
accessible whiteboard: supported display equations when useful, defined
notation, short prose/ASCII fallback if rendering is uncertain, language-
labelled code fences, readable timelines/tables, and no speech-only
explanation. Offer a hint ladder and counterexample before a direct answer.
End with learner-controlled evidence: defended claim, repaired assumption,
remaining uncertainty, next retrieval, and forward handoff. Do not use
pass/fail language, claim control of voice/model/rendering settings, or claim
that a Notion note was written without direct confirmation.
~~~

### Study Partner — M32 live rehearsal

The Study Partner is non-grading. It helps the learner reason aloud, inspect
code, change premises, and prepare a concise TA handoff; it does not administer
the formal oral defense.

~~~text
You are Atlas Academy's M32 Study Partner. Facilitate a live or text concept
discussion about systems languages, scientific arrays, and accelerators. Use
the visible conversation as an accessible whiteboard: define every symbol,
render equations only when supported and include prose/ASCII fallbacks, show
code in language-labelled fences, and make state/ownership timelines readable
after the session. Invite the learner to trace one request from API boundary
to result observation, then alter exactly one premise and predict the change.
Help them inspect an AI-generated performance or framework claim without
treating it as authority. Keep hardware claims conditional on evidence. End
with a compact TA handoff: strongest insight, unresolved misconception,
artifact inspected, and next question. Do not grade or conduct the formal
oral defense. Do not claim a live setting, voice session, rendered equation,
or Notion write occurred without direct evidence.
~~~

### Conversational oral defense — M32

This is an encouraging evidence conversation, not a conventional rigid exam.
The learner may ask for a hint, pause, write instead of speak, correct the
summary, or move an off-record portion outside any learning note.

**Suggested agenda, 15–20 minutes**

1. The learner chooses one artifact and explains the scientific question and
   semantic oracle.
2. The TA asks for the public contract, one ownership point, and one
   representation fact.
3. The TA changes one premise: a negative stride, hidden copy, delayed
   synchronization, early reuse, dtype change, or modified timing boundary.
4. The learner revises the narrowest defensible claim and names a
   counterexample or next falsifier.
5. The learner decides what evidence summary, if any, should be retained.

**Hint ladder**

1. Ask: "Which event makes the result observable?"
2. Ask: "Who owns this buffer immediately before and after that event?"
3. Draw only the two relevant rows of a timeline.
4. Contrast a host submission clock with a completion-aware clock.
5. Offer a direct explanation only after the learner has made a prediction.

**Constructive evidence lenses**

| Lens | Learner-facing prompt |
| --- | --- |
| boundary | "Which public promise are you relying on, and what is private?" |
| representation | "What metadata could change the behavior without changing the shape?" |
| history | "What dependency protects this read, write, reuse, or wait?" |
| numerics | "Which dtype/tolerance/domain condition narrows your conclusion?" |
| measurement | "Which work did your clock include and exclude?" |
| transfer | "What changed premise would most challenge your claim?" |

### Learner-controlled evidence summary and note boundary

End with: **defended claim**, **repaired misconception**, **evidence
inspected**, **remaining uncertainty**, and **next action**. The learner may
correct, decline to save, or keep the summary locally. The portal must not
automatically export it. A designated Codex TA or Study Partner chat may create
only a concise privacy-bounded learning note under its configured workflow;
that possibility is not evidence that a note, voice session, whiteboard
rendering, or export occurred.

### Record boundary for designated chats

A learner-controlled summary stays local unless, in the exact configured
designated Teaching Assistant or Study Partner chat, the learner says `records
on` for this substantive session. Only then may the shared policy create at
most one concise note if the configured private destination is reachable.
`pause records` or `off-record` means create nothing; authorization ends with
the session. Never save a raw transcript or claim a successful write without
direct evidence. Otherwise, keep the summary in chat or local notes.

### Forward handoff

The durable M32 artifact is a **reproducible systems claim packet**:
Boundary Contract Map, representation/numerics note, execution and
ownership trace, benchmark or design-only evidence card, environment record,
and unresolved-risk list. M33 receives the broader question of formal
description and computational limits. M35 and M36 may later reuse the packet
to inspect training systems, evaluation, and reliability claims. M25/M26
remain gated synthesis work until their own requirements are complete.

---

## Sources, licensing, and responsible reading route

This workbook uses original explanations, fixtures, diagrams, and prompts. The
linked material is for study and provenance; it is not copied source text,
code, figures, benchmarks, or exercises. Research was rechecked for this
bounded NumPy observation on **2026-08-01** and for the Python buffer-protocol,
scientific-Python capability, and university-calibration routes on
**2026-08-02**. Documentation moves, so a future publication must recheck URLs,
versions, access dates, licenses, and exact environment scope.

### Learner-facing university calibration route

| Source cluster | Claim linkage and reason to read | Reuse boundary |
| --- | --- | --- |
| [Stanford CS149 Parallel Computing](https://cs149.stanford.edu/), [CMU 15-418/618](https://www.cs.cmu.edu/~418/schedule.html), and [MIT 12.010 Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | Sessions 1–6: work distribution, locality/communication, synchronization, workload-driven measurement, scientific-programming evidence, and reproducibility. These are curriculum-calibration routes, not a promise of identical labs, hardware, or grading. | Link-only/original Atlas fixtures and explanations. Check individual course asset terms before reuse; do not copy assignments, recordings, slides, or benchmark claims. |

### Learner-facing source links

| Source cluster | Claim linkage and reason to read | Reuse boundary |
| --- | --- | --- |
| [Python extension and C API](https://docs.python.org/3.14/extending/extending.html), [buffer protocol](https://docs.python.org/3.14/c-api/buffer.html), [memoryview](https://docs.python.org/3/library/stdtypes.html#memory-views) | Sessions 1 and 3: public/native boundaries, buffer descriptors, lifetime and contiguity requests. | PSF License v2; link-only and original paraphrase. Pin interpreter/build target before a concrete claim. |
| [NumPy 2.3 array layout](https://numpy.org/doc/2.3/reference/arrays.ndarray.html), [copies and views](https://numpy.org/doc/2.3/user/basics.copies.html), [`shares_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.shares_memory.html), [`may_share_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.may_share_memory.html), plus [current stable broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) | `M32-C03–M32-C04`, Session 3: versioned vocabulary for the frozen 2.3.5 observation, then a clearly separate route to moving documentation. | NumPy BSD-3-Clause; link-only and original fixtures. The fixed observation pins NumPy 2.3.5; recheck behavior/version before release. |
| [SciPy tutorial](https://docs.scipy.org/doc/scipy/tutorial/index.html) and [Array API capability caveats](https://docs.scipy.org/doc/scipy/dev/api-dev/array_api.html) | Session 3: scientific algorithms have function-, version-, backend-, and device-specific capability boundaries. | SciPy BSD-3-Clause; link-only/original capability questions. Never turn a documentation route into blanket CPU/GPU/backend support. |
| [Cython memoryviews](https://cython.readthedocs.io/en/3.1.x/src/userguide/memoryviews.html), [Numba performance guidance](https://numba.readthedocs.io/en/stable/user/performance-tips.html) | Sessions 1 and 3: compiled/native routes are explicit contracts, not automatic gains. | Apache-2.0 and BSD-2-Clause respectively; link-only/original paraphrase. |
| [CUDA asynchronous execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html), [HIP overview](https://rocm.docs.amd.com/projects/HIP/en/docs-6.1.0/) | Sessions 2 and 4: host/device distinction, streams, events, and backend-specific limits. | NVIDIA documentation is proprietary; ROCm components vary. Link-only; never infer universal support. |
| [JAX asynchronous dispatch](https://docs.jax.dev/en/latest/async_dispatch.html), [JAX autodiff](https://docs.jax.dev/en/latest/automatic-differentiation.html), [PyTorch CUDA semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html), [PyTorch autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html) | Sessions 2, 4, and 5: readiness boundaries, framework-specific execution, and autodiff scope. | Apache-2.0/BSD-3-Clause projects; link-only/original paraphrase. Pin framework/backend/runtime/device versions. |
| [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html) | Session 6: bounded reproducibility/environment claims. | BSD-3-Clause; link-only. A seed is not cross-platform identity. |

For the fuller primary-source ledger, source rationale, access/reuse cautions,
and planned claim/counterexample map, read the instructor-facing
[M32 source research dossier](../source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md).

## Candidate release boundary

Before this draft can move into the released portal learner route, it needs an approved canonical
source-map binding, structured delivery/contract review, original bounded
reference fixtures or a safe equivalent interaction, diagnostics/review
records, accessibility and teaching-flow review, exact CI/deployment
provenance, and human approval. Hardware, compiler, framework, and benchmark
claims also need their own versioned evidence records. Until then this remains
an authoring artifact—not a published module, navigable route, deployment
claim, oral-defense result, or learner mastery claim.
