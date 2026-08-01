# Module 24 — CPython, Performance & Memory Evidence

> **Arc V — Languages, intelligence, and integration**
> **Bridge:** Module 23 gave a program a semantic path: source, structure,
> environment, evaluator, and bounded result. This module asks a different
> question: when a trusted Python program runs, which facts belong to the
> language, which belong to one CPython build, which came from a measurement,
> and which are still only hypotheses?

**Primary outcome:** You can read an AI-proposed performance patch without
mistaking a plausible story for evidence. You can preserve semantic behavior,
trace objects and aliases, choose a memory or timing metric that matches a
specific question, inspect a small version-pinned CPython implementation path,
design a controlled comparison, and make an accept, reject, or defer decision
with visible limits.

This is not a catalogue of Python “speed tricks.” It is a runtime-evidence
module. We will use a single Atlas incident: a reporting route has increasing
latency and a suspicion of retained memory. A generated patch replaces one
list materialization with streaming and adds a process-global cache. The patch
may be useful, harmful, both, or neither. We do not get to decide before we
state the contract, inspect the data flow, and measure under a manifest.

---

## How to study this module

Use this loop in every session:

1. State the behavior that must not change.
2. Label the current statement: language contract, CPython observation,
   measurement, OS/native observation, or hypothesis.
3. Predict the next representation or measurement before revealing it.
4. Read a fixed trace, source excerpt, or model packet.
5. Name the missing control, scope, or falsifier.
6. Write a one-sentence bounded decision: accept, reject, or defer.

The durable question is:

> Which claim does this evidence actually support, on which runtime and
> workload, and what still could make the conclusion false?

### The exact cumulative invariant

> **Atlas does not merge an “optimization” merely because a benchmark looks
> better or an AI agent wrote passing code. A candidate change first preserves
> the declared semantic contract and privacy boundary. Every runtime claim is
> labelled as a Python contract, a version-pinned CPython observation, a
> measurement under a declared manifest, an OS/native observation, or a
> hypothesis. The decision records workload, runtime/build, metric scope,
> controls, confounders, result, limitation, and the next falsifying test.
> A cache is data retention and authority design, not a neutral speed
> mechanism.**

This is an Atlas teaching contract. It does not prove production latency,
memory safety, a service-level objective, behavior on another Python
implementation, or suitability of a cache for real learner records.

### Evidence labels

| Label | What it can establish | What it cannot establish |
|---|---|---|
| **[PYTHON CONTRACT]** | A language-level object, binding, resource, or API rule documented for Python. | Address layout, refcount timing, bytecode shape, allocator behavior, or speed. |
| **[CPYTHON 3.14.6 OBSERVATION]** | A fact observed or read in the pinned CPython 3.14.6 build/source route. | A guarantee for PyPy, another CPython release, or every host. |
| **[MEASUREMENT UNDER MANIFEST]** | A timing/allocation result for one declared runtime, host, workload, and method. | General causality, total process memory, a production SLO, or semantic correctness by itself. |
| **[OS/NATIVE OBSERVATION]** | A host-level RSS, CPU, page, or native-allocation observation where available. | A portable Python-object attribution. |
| **[HYPOTHESIS]** | A proposed cause, mechanism, or decision together with a falsifier. | Proof without a controlled comparison. |
| **[UNKNOWN]** | Current evidence does not settle the question. | That a desired conclusion is false. |

### Runtime evidence card

~~~text
Reference: module24_reference.py
Tests:     test_module24_reference.py
Scope:     deterministic, bounded model of evidence review, not a CPython emulator
Runtime:   local Python implementation/version evidence environment for a separately
           captured experiment; CPython 3.14.6 is a source-reading baseline,
           not the detected CLI host
Core model: fixed scenario names only; no caller-provided program or data path
Core effects: no network, profiler attachment, process inspection, subprocess,
              package, credential, learner-data, or caller-provided file action
Local test-harness I/O: CLI selects a fixed scenario and writes JSON to stdout;
                        behavioral tests import the checked-in local model
Core rule: semantic behavior before performance conclusion
~~~

**Runtime artifacts:** [download the local reference model](/downloads/module24_reference.py)
and [download the behavioral tests](/downloads/test_module24_reference.py).

From the work directory, inspect the fixed casebook:

~~~text
python module24_reference.py --help
python module24_reference.py reject_confound
python test_module24_reference.py
~~~

The model makes evidence review visible. It does not time a real machine,
count CPython references, collect an actual heap, or infer a real leak.

---

## 1. Position in the knowledge system

### 1.1 The connected route

~~~mermaid
%% atlas-diagram-id: m24-cpython-observation-knowledge-route
%% atlas-diagram-title: Semantic contracts, object graphs, system lenses, and experiments bound CPython observations
%% atlas-diagram-alt: Cost-model assumptions and Module 23 semantic paths inform a CPython observation, while representation work supplies an object graph. Tests, machine and OS resource lenses, concurrency limits, and privacy retention boundaries shape an experiment manifest and bounded decision; Module 32 remains authoring-only.
flowchart LR
    M5["M5: cost model<br/>assumptions"] --> C["semantic contract"]
    M6["M6/8/9: representation,<br/>aliasing, indexes"] --> O["object graph"]
    M13["M13: tests + observability"] --> T["test and trace seam"]
    M17["M17/18: machine + OS<br/>resources"] --> N["native / host lens"]
    M19["M19: concurrency<br/>and measurement limits"] --> X["experiment manifest"]
    M22["M22: privacy + trust"] --> R["retention boundary"]
    M23["M23: semantic path"] --> C
    C --> P["CPython observation"]
    O --> P
    T --> X
    N --> X
    R --> D["bounded decision"]
    P --> D
    X --> D
    D --> M32["M32: systems languages,<br/>scientific Python & accelerators<br/>(authoring-only)"]
~~~

**Text equivalent:** earlier modules tell us what the program means, what data
structures and APIs promise, what resources the operating system mediates, and
why an observation has limited scope. Module 24 adds a disciplined bridge from
that semantic model to a particular CPython implementation and a controlled
experiment. **Canonical forward handoff: Module 32.** Module 32 is
authoring-only in the current course release, so Module 24 ends the currently
readable runtime-evidence path rather than unlocking a next Core module.
Modules 25 and 26 are later preview-only synthesis/capstone material after the
M31–M36 chain; they are not Module 24's direct learner path.

### 1.2 The fixed Atlas incident

The reporting route currently materializes all matching learning events, then
computes a redacted aggregate. A generated patch says:

~~~python
# Deliberately incomplete review fixture — do not adopt without evidence.
_summary_cache = {}

def weekly_summary(events, cohort):
    if cohort in _summary_cache:
        return _summary_cache[cohort]
    answer = sum(1 for event in events if event["cohort"] == cohort)
    _summary_cache[cohort] = answer
    return answer
~~~

The patch has at least four independent questions:

| Question | Tempting shortcut | Review requirement |
|---|---|---|
| Semantics | “Both versions return a count.” | Do missing, malformed, changed, and redacted records behave identically? |
| Cost | “A generator is always lower memory.” | Which workload, peak metric, and allocation path were compared? |
| Retention | “The cache is only an optimization.” | What cohort-derived data persists, for how long, under what invalidation and access rule? |
| Evidence | “One timing improved.” | Which runtime/build, warm-up, GC state, host load, repetitions, and distribution support that conclusion? |

The course response is deliberately slower than the shortcut:

~~~text
behavioral contract + fixtures
  → object/data-flow and retention map
  → CPython-specific inspection, explicitly version-pinned
  → metric selection and controlled measurement manifest
  → candidate-versus-baseline comparison
  → bounded release decision + limitation + next falsifier
~~~

### 1.3 A claim changes owner at every layer

~~~text
“This answer is correct”              → semantic tests and specification owner
“This object became unreachable”      → object-graph / language-model owner
“CPython dropped a reference here”    → pinned implementation observation owner
“This run used less traced memory”    → measurement manifest owner
“This route is production-safe”       → no single metric can own this claim
“Keep this cache”                     → data retention, privacy, and release owner
~~~

**Stopping line:** faster is not a behavior. A lower number does not grant
permission to retain data. A specialized opcode is not a Python guarantee.

---

## 2. Session 1 — Evidence before optimization

### Pressure

“The patch is clearly faster. Can we ship it?”

Not until the word “faster” has a subject, comparison, unit, workload, and
scope. More importantly, not until the behavior and data boundary are named.

### Derive the claim ladder

Start with the smallest stable fact:

~~~text
input fixture
  → declared output contract
  → baseline / candidate semantic comparison
  → runtime and build identity
  → workload + measurement method
  → samples + controls + confounders
  → bounded engineering decision
~~~

The arrows are not bureaucracy. They stop a local observation from becoming a
global claim.

### Prediction exercise

Before revealing the ledger, classify each line:

1. “Python dictionaries preserve insertion order.”
2. “This CPython 3.14.6 bytecode listing has a specialized instruction.”
3. “This workload’s median wall-clock sample fell by 12% on one host.”
4. “The cache will reduce production latency for every cohort.”

**Reveal:** 1 is a language/API claim whose exact scope still needs a source.
2 is an implementation observation. 3 is a measurement under a manifest.
4 is a hypothesis that needs deployment-representative evidence and a
retention review.

### Code-reading lab

Read the baseline/candidate pair without running it. Mark:

- the externally visible output;
- each input precondition;
- each retained value and key;
- one error path;
- one resource/cost hypothesis;
- one privacy question.

Then write a claim-owner matrix:

| Claim | Owner | Evidence needed | Nonclaim |
|---|---|---|---|
| Count result matches | semantic test | fixture comparison | performance |
| Candidate allocates less traced memory | experiment | manifests + snapshots | lower RSS |
| Cache is permitted | data/authority review | retention contract | a speed result |

### TA check

The TA asks: “Which statement could be disproved by a changed workload without
changing the source code?” If you answer “the semantics,” return to Module 13.
If you answer “the speed conclusion,” explain the missing distribution.

---

## 3. Session 2 — Objects, aliases, and lifetime

### Pressure

“I deleted the variable, so why is the object still there?”

A name is a binding, not a container that owns a unique value. Module 1 gave us
that model. Now apply it to a graph.

### First-principles model

~~~mermaid
%% atlas-diagram-id: m24-shared-reference-lifetime
%% atlas-diagram-title: Deleting one name leaves a shared list reachable through another binding
%% atlas-diagram-alt: The names report and debug_snapshot both refer to one shared list containing two events. Deleting report removes only that binding, while debug_snapshot still reaches the list and its events; the diagram distinguishes name deletion from object destruction.
flowchart LR
    A["report"] --> L["shared list"]
    B["debug_snapshot"] --> L
    L --> E1["event 1"]
    L --> E2["event 2"]
    C["del report"] -. "removes one binding" .-> A
    B --> L
~~~

**Text equivalent:** report and debug_snapshot both point to the same list.
Deleting report removes that binding. It does not prove the list is
unreachable because debug_snapshot still points to it.

### What Python promises and what it does not

The Python data model gives objects identity, type, and value. It does not
promise an address layout, an exact reclamation moment, a visible refcount, or
one garbage-collection algorithm. Do not use a convenient CPython observation
to rewrite the language contract.

### Fixed trace

~~~python
events = [{"id": 1}]
audit_view = events
events = []
~~~

Predict:

1. Does audit_view become empty?
2. Did rebinding events mutate the prior list?
3. What does this trace say about when the prior list is reclaimed?

**Reveal:** audit_view still references the original one-item list. Rebinding
events did not mutate it. The trace establishes neither an address nor a
portable reclamation schedule.

### CPython observation boundary

On a pinned CPython build, reference counting and cyclic garbage collection
are implementation facts worth reading. A CPython call such as sys.getrefcount
is not a pure graph oracle: it includes a temporary reference and interacts
with implementation features such as immortal objects. Treat it as a scoped
debugging observation, never as portable logic.

### Practice

Draw two object graphs for the Atlas cache: before invalidation and after a
request finishes. Circle every root that can keep a cohort-derived object
reachable. State one fact you can infer and one fact you cannot.

---

## 4. Session 3 — Cycles, collection, and resource ownership

### Pressure

“CPython uses reference counts, so unneeded things disappear immediately.”

That model works for a simple acyclic case. It is incomplete for cycles, and
it is the wrong model for resources that need explicit closure.

### Derive the two-phase teaching model

~~~text
roots
  → follow references
  → unreachable acyclic node: simple reference-count model can release it
  → unreachable cycle: references inside the cycle remain
  → explicit cycle-detection phase: model can identify the unreachable cycle
  → resource decision: close explicitly; never wait for collection
~~~

The local reference model exposes this as a deterministic teaching graph. It
does not emulate CPython’s exact collector generations, thresholds, finalizer
rules, or allocator.

### Prediction exercise

~~~text
root → A → B
         ↑   ↓
         └───┘
~~~

If root is removed, what remains after a simplified reference-count sweep?
What additional reasoning can identify the cycle as unreachable?

**Reveal:** the internal A↔B references prevent a simple local-count rule from
reducing both to zero. Reachability from roots, or a cycle-collection phase,
can identify the cycle. Exact CPython collector behavior remains
version-specific.

### Resource boundary

File-like objects, sockets, locks, database transactions, executors, and
external capabilities have a stronger requirement than “eventually
unreachable.” Use a context manager, explicit close, or lifecycle protocol
whose completion you can reason about. A finalizer is not a reliable release
plan, especially across errors, cycles, shutdown, and alternative
implementations.

### Debugging investigation

An AI patch keeps a cache of objects that own an external handle. Reject the
claim “the garbage collector will clean it up” unless the patch states:

- which resource owns the close operation;
- how success, error, timeout, and cancellation leave the resource;
- which explicit test observes closure;
- why cache retention is allowed.

### TA check

Explain the difference between “unreachable in this object graph” and
“released all system resources.” A correct answer names the resource protocol,
not just garbage collection.

---

## 5. Session 4 — Allocation and memory lenses

### Pressure

“The object is only 56 bytes, so memory cannot be the problem.”

That answer confuses a shallow object-size question with a retained-graph,
Python-allocation, native-allocation, or process-memory question.

### Choose the metric from the claim

| Question | Possible observation | What it omits |
|---|---|---|
| How large is this immediate Python object? | sys.getsizeof | referenced graph, allocator overhead, native buffers, RSS |
| Which Python allocations changed between snapshots? | tracemalloc snapshot | total native allocations and process memory |
| What was the traced current/peak allocation? | tracemalloc get_traced_memory | retention cause, RSS, production load |
| What did the process/host report? | OS metric where available | Python-object attribution and portability |
| Where was Python time attributed? | cProfile | benchmark-quality timing or causal proof |

### The memory-lens diagram

~~~mermaid
%% atlas-diagram-id: m24-memory-measurement-lenses
%% atlas-diagram-title: Distinct memory measurements answer different questions and forbid different inferences
%% atlas-diagram-alt: A memory question can use shallow object size, traced Python allocations, native or extension allocation, or process and OS memory. Each lens has a limit: shallow size does not reveal retained graphs, traced allocations do not reveal RSS, native memory does not identify a Python owner, and process memory does not identify a Python allocation site.
flowchart TB
    Q["Memory question"] --> S["shallow object size"]
    Q --> T["traced Python allocations"]
    Q --> N["native / extension allocation"]
    Q --> P["process / OS memory"]
    S --> X["Do not infer retained graph"]
    T --> Y["Do not infer RSS"]
    N --> Z["Do not infer Python owner"]
    P --> W["Do not infer Python allocation site"]
~~~

**Text equivalent:** each lens answers a different question. A number from one
lens cannot silently answer another lens’s question.

### Prediction exercise

Which conclusion is justified?

A. A smaller sys.getsizeof value proves lower process RSS.  
B. A lower traced-allocation peak proves a C extension allocated less native
memory.  
C. A snapshot difference can support a scoped claim about traced Python
allocations.  
D. A process RSS observation names the exact Python list responsible.

**Reveal:** C only. The other answers cross a scope boundary without evidence.

### Code-reading lab

Read this deliberately insufficient report:

~~~text
candidate peak = 1.2 MB
baseline peak  = 3.4 MB
therefore production memory leak fixed
~~~

Rewrite it as an honest observation, then list three missing facts:
runtime/build, workload and repetitions, trace-start/stop placement, native
allocation scope, retained roots, process metric, or production duration.

### Privacy connection

A cache that reduces allocation can still create an unacceptable retention
surface. For each memory measurement, keep fixtures synthetic/redacted and
record whether a metric or dump could expose identities, raw payloads, paths,
or secrets.

---

## 6. Session 5 — Source, code object, frame, bytecode

### Pressure

“I saw a bytecode instruction, so that is how Python works.”

Bytecode is a CPython implementation detail. It is useful precisely when we
label its version and do not turn it into language law.

### A deliberately narrow CPython route

~~~text
Python source
  → compiled code object
  → frame / interpreter dispatch
  → adaptive bytecode observation on CPython 3.14.6
  → specialization machinery and cached implementation state
  → host execution and measurement
~~~

Read only short, pinned excerpts with a question:

| Source target | Question it can help answer | Nonclaim |
|---|---|---|
| InternalDocs/interpreter.md | Which components does CPython describe in its interpreter route? | Python language semantics |
| Python/bytecodes.c | What does a particular bytecode definition say in this source revision? | Stable opcode list |
| Python/specialize.c | How does this implementation discuss specialization? | Guaranteed speedup |
| Modules/gcmodule.c | Which collector structures exist in this revision? | Exact collection timing |
| Objects/obmalloc.c | Which allocator mechanism is described? | Process RSS behavior on every host |

### Fixed source-inspection plan, not a captured disassembly

This fixed source snippet is a question prompt, not `dis` output. It does not
establish an opcode sequence, a local runtime/version, or a speed result.

~~~python
def total(values):
    return sum(values)
~~~

Before a learner reads any actual disassembly, record the implementation,
Python patch version, `dis` options, trusted function, and captured output.
Do not ask a learner to optimize from an opcode list. Instead ask:

1. Which runtime and version would have to produce a real display?
2. What semantic behavior remains independent of any display?
3. Which experiment would be required before claiming a speed effect?

### Warm-up is a measurement condition

Adaptive behavior may make cold and warm observations differ. Neither is
automatically more “real.” A manifest names warm-up policy, input distribution,
GC state, interpreter/build flags, repetitions, statistic, and host load
assumptions. It does not merely print one elapsed time.

### AI-patch review

The generated patch says “this specialization makes the loop fast.” Mark it
**[HYPOTHESIS]**. Treat the causal sentence as a hypothesis, not a CPython
observation. A pinned `dis` capture could support a narrow implementation
observation; a controlled experiment could support a narrow measurement. Both
still need semantic tests green. Ask whether a different Python implementation
or future CPython release changes the conclusion.

---

## 7. Session 6 — Experiment and AI-patch review

### Pressure

“Tests pass, profile looks hot, benchmark is lower. Merge?”

There are three different forms of evidence there, and none alone decides the
release.

### Build the experiment manifest

~~~text
claim:
baseline and candidate:
semantic fixtures:
runtime / version / build:
host and load conditions:
input distribution and size:
warm-up policy:
GC policy:
metric and scope:
sample count + statistic:
confounders:
privacy / retention review:
result:
limitation:
next falsifier:
decision:
~~~

### Controlled comparison rules

Reject or defer a performance conclusion if any of these changed without being
part of the question:

- semantic output or error behavior;
- workload distribution, input size, or fixture;
- runtime version/build/configuration;
- warm-up policy or GC condition;
- metric scope or start/stop boundary;
- host contention or sample method;
- data retention, caching key, invalidation, or authorization policy.

### Decision table

| Outcome | Minimum evidence | Example |
|---|---|---|
| **ACCEPT (bounded)** | semantic equivalence, controlled result, privacy/retention approval, limitation | stream change reduces traced allocation for the declared fixture; no new retention |
| **REJECT** | semantic or boundary violation | cache retains cohort data without expiry/purpose rule |
| **DEFER** | plausible hypothesis but missing control or scope | one timing sample lacks workload and GC policy |

### Casebook exercise

The Runtime Evidence Casebook contains fixed packets. For each:

1. choose the evidence label;
2. identify a confounder or missing fact;
3. state the strongest allowed conclusion;
4. choose accept, reject, or defer;
5. name one next falsifying test.

### TA and Study Partner rehearsal

The TA asks five questions:

1. What behavior must remain invariant?
2. Is your statement a language contract, CPython observation, measurement, or
   hypothesis?
3. Which metric did you choose and what does it omit?
4. Which control is missing?
5. What would falsify the conclusion?

The Study Partner changes exactly one fact — runtime version, input
distribution, GC setting, CPU condition, native allocation, or cache policy —
and asks which conclusions survive. Swap roles after ten minutes.

---

## 8. Runtime Evidence Observatory

The visual studio for this module is a fixed, accessible **Runtime Evidence
Observatory**, not a fake live profiler.

~~~text
Python contract
    ↓
CPython 3.14.6 observation
    ↓
object graph / allocation lens
    ↓
measurement manifest + fixed observations
    ↓
bounded engineering decision
~~~

It has six prediction-first views:

1. **Claim stack** — separate semantic, implementation, measurement, and
   hypothesis cards.
2. **Object graph** — move one root at a time and predict reachability.
3. **Collection boundary** — distinguish simplified reference sweep from
   explicit cycle collection and resource closure.
4. **Memory lenses** — choose shallow, traced, native, or process scope; read
   the nonclaim before reveal.
5. **Execution route** — follow source to code object, frame, bytecode, and
   pinned implementation excerpt without treating the view as a universal VM.
6. **Patch decision** — audit the generated cache/streaming patch and produce
   an accept/reject/defer record.

Every fact has a text equivalent. Controls use native buttons, visible focus,
keyboard operation, reduced motion, and only whitelisted local progress state.
No learner code, profile file, raw event, or personally identifying data is
accepted or stored.

---

## 9. Confidence-aware diagnostic

Choose an answer, record confidence, then explain the missing evidence before
reading the rationale.

### Q1 — Identity

Which statement is safe across Python implementations?

A. id(x) is x’s memory address.  
B. An object has identity, type, and value.  
C. sys.getrefcount(x) gives the exact graph in-degree.  
D. del x immediately destroys x.

**Answer: B.** The language data model uses identity/type/value. A is a
CPython-specific observation at most; C includes implementation effects; D
removes a binding, not a portable destruction promise.

### Q2 — Shallow size

Which conclusion follows from a lower sys.getsizeof value?

A. The entire retained graph is smaller.  
B. Process RSS will fall.  
C. This immediate object’s reported shallow size is lower.  
D. A native extension allocated less.

**Answer: C.** The function reports a direct/shallow size. A, B, and D cross
to different memory lenses.

### Q3 — Tracing

What does a lower tracemalloc peak most directly support?

A. A scoped claim about traced Python allocations in that experiment.  
B. A guarantee of lower total native memory.  
C. Proof that no memory is retained.  
D. A production memory SLO.

**Answer: A.** The metric has a declared tracing scope. It does not become RSS,
native allocation, retention analysis, or production evidence.

### Q4 — Bytecode

An observed specialized opcode proves:

A. Python language semantics changed.  
B. every Python implementation has the same optimization.  
C. a version-pinned CPython implementation observation only.  
D. the program is faster for every workload.

**Answer: C.** Bytecode and specialization are CPython/version-specific
implementation evidence. A, B, and D require different sources or experiments.

### Q5 — Benchmark

A candidate run is faster once, but its input size and GC setting differ from
baseline. What is the correct decision?

A. accept; a lower number wins.  
B. reject the language.  
C. defer the performance conclusion as confounded.  
D. call it a memory leak.

**Answer: C.** The change may still be useful, but the comparison no longer
answers a controlled question.

### Q6 — Cache

Why must a global cache receive a trust/privacy review?

A. Caches are never fast.  
B. It may retain derived learner/cohort information across requests and change
   invalidation, access, purpose, and incident surface.  
C. Python forbids dictionaries.  
D. A cache automatically changes language semantics.

**Answer: B.** Retention and authority are system-design questions. The other
answers overgeneralize.

### Diagnostic routing

| Miss pattern | Repair route |
|---|---|
| bindings/aliasing | Module 1, Module 6, this module Session 2 |
| cost/metric confusion | Module 5, Module 13, Session 4 |
| implementation-overclaim | Module 17, Module 23, Session 5 |
| experiment confusion | Module 5, Module 19, Session 6 |
| trust/retention confusion | Module 22, Session 4 and 6 |

---

## 10. Problem ladder and Atlas project

### Problem ladder

1. **Label:** classify ten statements by evidence owner and write one
   nonclaim for each.
2. **Trace:** draw the roots and aliases in a two-cache object graph; predict
   which objects remain reachable after each rebinding.
3. **Diagnose:** reject a shallow-size report that claims to measure RSS.
4. **Read:** annotate a fixed CPython source/bytecode card with version,
   question, observation, and nonclaim.
5. **Design:** repair a confounded benchmark manifest without changing
   production code.
6. **Defend:** review the Atlas patch, including retention and rollback, before
   choosing a release decision.

### Project — Runtime Evidence Dossier

Produce a design dossier, not a speed-coding contest. Use the fixed Atlas
reporting incident and include:

- semantic contract and baseline/candidate fixture table;
- object/data-flow diagram and cache-retention decision;
- one CPython 3.14.6 source-reading card labelled as an observation;
- memory-metric selection table with stated omissions;
- controlled timing/allocation manifest, fixed sample packet, and limitation;
- AI-patch review that accepts, rejects, or splits the proposal;
- rollback condition, privacy consequence, and next falsifying experiment.

### Acceptance rubric

| Dimension | Emerging | Evidence-ready handoff |
|---|---|---|
| Semantic discipline | repeats “same output” | names outputs, errors, invariants, and tests |
| Evidence scope | treats all numbers alike | labels contract, CPython, measurement, OS/native, hypothesis |
| Measurement | reports one elapsed time | supplies a controlled manifest and nonclaims |
| Memory reasoning | uses one size as total memory | selects a lens and explains its omission |
| AI-era judgment | accepts an agent patch after tests | reviews authority, retention, confounders, and alternatives |
| Communication | gives a conclusion | gives evidence, limitation, owner, and falsifier |

---

## 11. Retrieval schedule and handoff

- **Tomorrow:** redraw the claim ladder and give one nonclaim for every
  evidence label.
- **In three days:** explain why a lower traced-allocation peak is not lower
  RSS, and why a cache is a privacy decision.
- **In one week:** take one old performance intuition and rewrite it as a
  controlled hypothesis with a falsifier.
- **In two weeks:** defend one Atlas patch to a Study Partner who changes the
  workload or runtime version.

**Canonical forward handoff: Module 32.** Module 32 is authoring-only in the
current course release, so this dossier is a stopping point for the readable
runtime-evidence branch—not an unlock token for another module. When the
advanced chain is released, carry this discipline into its systems-language and
accelerator work. Modules 25 and 26 remain later preview-only synthesis and
capstone material after M31–M36, not Module 24's next learning step. Their
shared conceptual lesson remains useful: a score, ranking, model, agent output,
or retrieved text is not a decision, an authority grant, a probability, or a
human benefit until its data lineage, evaluation, policy, explanation, and
override path are explicit.

---

## 12. Source route and reuse boundary

Use the companion Module 24 source map for claim-to-source routing. Core
reading includes the Python 3.14 data model, sys, gc, tracemalloc, timeit,
profile, dis, and C-API memory/reference-count documentation; pinned CPython
3.14.6 interpreter, bytecode, specialization, garbage-collection, and
allocator source routes; PEPs 659, 683, and 703 for historical/design context;
and MIT 6.172 / Berkeley CS 61C for performance and memory-hierarchy
pedagogy.

Python documentation and CPython source are governed by the PSF License v2;
documentation examples/recipes additionally carry a 0BSD grant. Atlas uses
original prose, diagrams, fixtures, questions, and teaching code. Link to
primary materials and preserve required notices if any excerpt or derivative
is redistributed. University material is used for sequencing and links, not
copied assignments or solutions.
