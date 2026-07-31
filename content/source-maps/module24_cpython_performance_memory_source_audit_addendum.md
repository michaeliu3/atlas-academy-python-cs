# Module 24 — CPython, Performance, and Memory: Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** source ownership, claim linkage, version/status freshness, reuse
decisions, bounded-model limits, learner-facing truth corrections, and
release-truth checks for the existing Module 24 workbook, visual studio,
source map, and reference downloads.

## Status and delivery boundary

This is an instructor-facing, **authoring-only** audit record. It is not
learner-facing textbook copy, a human-quality approval, release evidence, or a
publication decision. It is **not a public learner download or
release-evidence-policy artifact**; it is not learner-downloadable. The
canonical M24 source map and the primary-source research note are also
authoring boundaries rather than configured M24 learner downloads.

A later non-promoting structural packet may include this addendum as a
**hashable internal release input** only after its contract and release-input
ledger deliberately allow it. That mechanical inclusion does **not** change
M24's legacy-audit status, human-review status, availability, route position,
release evidence, deployment state, or publication state. A Git-tracked path
or a hash never automatically makes the canonical map, this addendum, or the
research note a learner-facing delivery artifact.

## Canonical route reconciliation

The canonical knowledge route is **M23 → M24 → M32**. M23 supplies the
semantic/authority boundary: a parse, source excerpt, code object, or bytecode
card is not a language guarantee or permission claim. M24 adds the rule that
a performance conclusion requires a named contract, workload, provenance,
measurement method, and uncertainty boundary.

M32 is authoring-only in the current course graph. Therefore M24 ends the
currently readable runtime-evidence path and does not unlock another Core
module. M25/M26 are later preview-only synthesis material after the M31–M36
chain; they are not M24's direct learner path or a prerequisite bypass. The
workbook, canonical map, and Runtime Evidence Observatory preserve this route
boundary.

## Source and reuse ledger

The companion [primary-source research note](module24_cpython_performance_memory_source_research.md)
is an authoring-only recheck. It records direct primary-source access on
2026-07-30; it constrains claims and reuse rather than approving any external
copying. The canonical map remains the source/claim spine. Link and paraphrase
by default; use original explanations, diagrams, fixtures, code, diagnostics,
and exercises. Public access is not reuse permission.

| ID | Owner/source and stable link | Claim linkage | Access, status, and reuse decision |
| --- | --- | --- | --- |
| **P24-A01** | Python Software Foundation: [Python 3.14 documentation](https://docs.python.org/3.14/), including [language reference](https://docs.python.org/3.14/reference/index.html), [dis](https://docs.python.org/3.14/library/dis.html), [gc](https://docs.python.org/3.14/library/gc.html), [sys](https://docs.python.org/3.14/library/sys.html), [tracemalloc](https://docs.python.org/3.14/library/tracemalloc.html), [timeit](https://docs.python.org/3.14/library/timeit.html), and [profile](https://docs.python.org/3.14/library/profile.html) | Sessions 1–6: semantic contract, version-labelled implementation evidence, GC/refcount/direct-size caveats, allocation scope, timing protocol, and profiler limits. | The 3.14 documentation route was observed as Python 3.14.6 on 2026-07-30. It is a version-family route, not a frozen patch artifact. Link/paraphrase under the PSF License v2/0BSD example boundary; recheck freshness and notices before review or reuse. |
| **P24-A02** | CPython [v3.14.6 tree](https://github.com/python/cpython/tree/v3.14.6), [InternalDocs/interpreter.md](https://github.com/python/cpython/blob/v3.14.6/InternalDocs/interpreter.md), [Python/bytecodes.c](https://github.com/python/cpython/blob/v3.14.6/Python/bytecodes.c), [Python/specialize.c](https://github.com/python/cpython/blob/v3.14.6/Python/specialize.c), [Modules/gcmodule.c](https://github.com/python/cpython/blob/v3.14.6/Modules/gcmodule.c), and [Objects/obmalloc.c](https://github.com/python/cpython/blob/v3.14.6/Objects/obmalloc.c) | Session 5 source-reading questions about interpreter, bytecode, specialization, collector, and allocator mechanisms. | The tag is the reproducible source-reading baseline. Link/paraphrase and retain the exact tag; an internal source file is neither Python language law, learner-runtime output, performance evidence, nor blanket copying permission. |
| **P24-A03** | [PEP 659](https://peps.python.org/pep-0659/), [PEP 683](https://peps.python.org/pep-0683/), [PEP 703](https://peps.python.org/pep-0703/), and [PEP 744](https://peps.python.org/pep-0744/) | Sessions 2–6: adaptive-interpreter design, immortal-object/refcount caveats, free-threaded configuration, and JIT design/status context. | Accessed 2026-07-30. PEP 744 was **Draft** at that access point; it is used only for its stated design/status context, not as a default-runtime, free-threaded, availability, or speed claim. Link/paraphrase; check each PEP's notice before quotation. |
| **P24-A04** | Canonical map sections [Primary-source ledger](module24_cpython_performance_memory_source_map.md#primary-source-ledger), [Claim-to-source matrix](module24_cpython_performance_memory_source_map.md#claim-to-source-matrix), [Pinned CPython source-reading map](module24_cpython_performance_memory_source_map.md#pinned-cpython-3146-source-reading-map), and [Licensing, reuse, and access ledger](module24_cpython_performance_memory_source_map.md#licensing-reuse-and-access-ledger) | Maps source owner, required evidence, nonclaim, and reuse boundary to each course claim. | This audit rechecked the narrow Python/CPython spine. The OS, NumPy, and university cards remain useful scoped links but were not silently promoted to source-license or pedagogical-quality approval by this recheck. |
| **A24-model** | Atlas [reference model](../../public/downloads/module24_reference.py) and [behavioral seam tests](../../public/downloads/test_module24_reference.py) | Sessions 2–6: fixed graph reasoning, evidence-requirement cards, manifest comparison, and deferral when real evidence is absent. | Original course artifacts. The model uses named synthetic fixtures and no caller-provided program/data path. It does not capture a CPython/dis/tracemalloc/RSS result, benchmark a host, or prove a real deployment claim. |
| **U24-01/U24-02/U24-03** | [MIT 6.172](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/), [Berkeley CS 61C memory hierarchy](https://notes.cs61c.org/content/caches-intro/memory-hierarchy/), and [AMAT notes](https://notes.cs61c.org/content/caches-intro/amat/) | Teaching sequence, systems vocabulary, and optional intuition for performance reasoning. | Public university pages were consulted for pedagogical context only. Link only: do not reproduce slides, assignments, recordings, figures, tests, code, solutions, or grading material. They do not own Python/CPython semantic claims. |

## Six-session claim linkage

This is a structural authoring crosswalk, not a human review of the workbook,
studio, diagnostics, accessibility, or assessment quality. The canonical
source map's [Teaching sequence and session claim boundaries](module24_cpython_performance_memory_source_map.md#teaching-sequence-and-session-claim-boundaries)
remains the detailed claim-owner route.

| Session | Workbook anchor | Source/claim connection | Mandatory stopping line |
| --- | --- | --- | --- |
| **1 — Evidence before optimization** | `#2-session-1--evidence-before-optimization` | P24-A01/A24-model; semantic contract, workload, and measurement design precede any conclusion. | Matching a model fixture or test does not establish a speed, memory, or production result. |
| **2 — Objects, aliases, and lifetime** | `#3-session-2--objects-aliases-and-lifetime` | P24-A01/P24-A03/A24-model; identity and refcount concepts require scope and implementation caveats. | A fixed graph or refcount discussion is not a real heap, ownership count, or leak verdict. |
| **3 — Cycles, collection, and ownership** | `#4-session-3--cycles-collection-and-resource-ownership` | P24-A01/P24-A02/A24-model; reference counting, reachability, and cyclic collection are distinct. | A simplified cycle result does not establish CPython collection timing or OS memory release. |
| **4 — Allocation and memory lenses** | `#5-session-4--allocation-and-memory-lenses` | P24-A01; getsizeof, tracemalloc, and process metrics observe different layers. | A declared metric card is not a captured allocation, RSS, native-memory, or leak result. |
| **5 — Source, code object, frame, bytecode** | `#6-session-5--source-code-object-frame-bytecode` | P24-A02/P24-A03; tagged source and actual recorded `dis` output have distinct evidentiary roles. | A source snippet or illustrative studio sequence is not captured disassembly, language law, or speed evidence. |
| **6 — Experiment and AI-patch review** | `#7-session-6--experiment-and-ai-patch-review` | P24-A01/P24-A03/A24-model; a manifest constrains a future comparison and an AI causal story remains falsifiable. | Matching manifests do not produce a measurement, deployment approval, or causal explanation. |

## Bounded model, studio, and CLI truth

The fixed reference model needs an especially strict boundary because its job
is to teach evidence discipline rather than fabricate host facts. Use this
precise wording:

> **The core model is a deterministic, bounded teaching model with no
> caller-provided program or data path; its CLI/test harness still has bounded
> process I/O (argument selection, local import, and JSON written to stdout).**

The CLI parses one enumerated scenario and writes one JSON packet to standard
output. The behavioral seam test imports the checked-in local model and
captures stdout/stderr. Those narrow tooling operations mean the model is not
a no-I/O model. They do not make it a sandbox, profiler, process inspector,
CPython emulator, real `dis` capture, `tracemalloc` result, RSS measurement,
benchmark, or deployment/test-environment claim.

Static graph/scope/manifest packets therefore use **[COURSE MODEL]** or a
deferral outcome and name the evidence that a later real observation would
need. A simplified cycle is not a **[CPYTHON OBSERVATION]**. A matching
manifest is **MANIFEST_READY**, not a measurement or an accepted patch. A
real bytecode, allocation, timing, or OS claim must carry its separately
captured runtime, build, options, workload, raw result, and manifest.

The Runtime Evidence Observatory is a static, original teaching surface. Its
bytecode instruction sequence is an illustrative bytecode card, not a captured
disassembly from the browser or learner runtime. Its status labels teach which
evidence would be required; they do not convert the card into that evidence.

## Learner-facing correction record

The following corrections align the learner materials with the source ledger
and avoid overclaiming:

1. The runtime evidence card now separates the fixed model from a local Python
   implementation/version evidence environment used for a separately captured
   real experiment. CPython 3.14.6 is a pinned source-reading baseline, not a
   detected CLI host.
2. The workbook's former “fixed disassembly packet” is now a fixed
   source-inspection plan, not a captured disassembly. An actual `dis` claim
   must record a trusted function, implementation/Python patch version, `dis`
   options, and captured output.
3. “This specialization makes the loop fast” is a **[HYPOTHESIS]**, not a
   CPython observation. A tagged source or real `dis` capture can motivate a
   narrow implementation observation; a controlled experiment can support a
   narrow measurement; neither proves broad causality by itself.
4. The source map now distinguishes accepted PEP contracts from PEP 744's
   Draft design/status context, says the `resource` module—not Module 24—is
   Unix-only, includes the pinned `InternalDocs/interpreter.md` target, and
   keeps JIT/free-threaded configurations separate.
5. The studio footer preserves the M24 → authoring-only M32 route. Any
   reference to M25/M26 is explicitly later preview-only synthesis rather than
   a navigation handoff.

## Preserved audit ambiguities and missing evidence

The immutable legacy audit records five **ambiguous** criteria and one
**missing** criterion for M24. A source ledger, a bounded model, a test, a
resolved Markdown anchor, or this addendum can make later review easier; none
substitutes for qualified review of learner-facing quality, accessibility,
pedagogy, source-license correctness, or psychological safety.

| Legacy criterion | Status that remains | Why this addendum cannot promote it |
| --- | --- | --- |
| **rigor bundle**: definitions, assumptions, derivations, proof ideas, counterexamples, and numerical experiments | **ambiguous** | The workbook's claim ladder and first-principles model are useful pointers, but this audit does not establish a coherent, accurate, reviewed rigor bundle. |
| **transfer task** | **ambiguous** | The problem ladder, dossier, and handoff offer candidates, not reviewed evidence that the transfer task or acceptance criteria work. |
| **accessible visual/text alternative** | **ambiguous** | The Observatory and textual workbook routes are pointers, not a qualified review of alternatives, keyboard behavior, screen-reader experience, or cognitive load. |
| **confidence diagnostic/misconceptions** | **ambiguous** | A confidence-labelled diagnostic and routing section do not prove valid misconception mapping, reveal timing, explanations, or learner repair records. |
| **TA prompt** | **ambiguous** | The TA/Study Partner rehearsal is not a verified, distinct operational TA prompt package or handoff workflow. |
| **supportive oral defense** | **missing** | The immutable audit found no module-specific oral-defense protocol anchor. Generic oral infrastructure does not satisfy the module-specific missing criterion. |

The prerequisite/forward map, six-session spine, first-principles pointer,
code-reading/debugging/design pointers, prediction pointer, source-ledger
pointer, retrieval pointer, project/rubric pointers, Study Partner pointer,
and forward handoff remain structural pointers where the immutable audit
already records them as present. This addendum neither changes those records
nor upgrades the five ambiguous criteria or the missing oral-defense criterion.

## Unresolved supportive oral-defense route

Module 24's supportive oral defense remains **missing**. The global guide in
`lib/oral-defense-guide.ts` and shared module surface can offer a general
conversation workflow, but generic oral infrastructure does not satisfy the
module-specific missing criterion. Before this status can change, a qualified
review must find or create a Module 24-specific, psychologically safe,
adaptive text/voice protocol with a learner-controlled evidence summary, hint
ladder, counterexample and transfer prompts, accessibility-equivalent text
route, and explicit support/repair choices. This addendum records the absence;
it does not silently create an oral-defense claim by pointing at a generic
component.

## Release-truth checks and unresolved provenance

None of the following becomes satisfied merely because this addendum exists or
its hash is recorded.

| Check | Current audit observation | Required action before an approval or release claim |
| --- | --- | --- |
| Source freshness | Python documentation routes, PEP status, tagged source availability, OS/NumPy pages, university pages, and notices can change. | Recheck direct URLs, editions, tags, access dates, status, and reuse notices at human review time. |
| Learner-visible claim linkage | The workbook uses selected links and downloads; the detailed canonical map, research note, and addendum are authoring artifacts. | Review session-visible claims, diagrams, prompts, labels, and links; decide deliberately whether any authoring artifact becomes delivered. |
| Asset and reuse inventory | This document approves no non-original external asset import. | Record owner, exact URL/version, access date, license/notice, attribution, modification, distribution decision, and reviewer for every shipped non-original asset. |
| Bounded reference model | The model/tests are finite teaching artifacts with bounded CLI/test-harness I/O and no actual runtime evidence. | Run declared tests, inspect import/effect boundaries, record environment/result, and preserve the distinction between a course model and a real experiment. |
| Human quality and accessibility review | Five audit ambiguities and the missing module-specific oral-defense route remain unresolved. | Preserve their exact statuses until qualified review records learner-facing evidence, including visual/text alternatives and oral interaction quality. |
| Provenance chain | A local path or hash alone does not prove delivery, reviewability, or a release. | Bind a reviewed Git commit, source ref, CI run, source review, known limitations, and any verified deployment fact without changing publication state by implication. |

## Evidence language to carry into M32

- A semantic contract, a source-reading observation, a measurement, and an
  OS/native observation are distinct claims with distinct owners.
- A fixed course model may explain evidence requirements; it cannot silently
  become a result from the learner's interpreter or host.
- A source snippet or illustrative bytecode card is not captured disassembly;
  name version, options, output, workload, and limits before making a narrow
  implementation claim.
- A valid comparison manifest is a prerequisite to collecting results, not a
  result, performance acceptance, deployment decision, or causal explanation.
- M32 must preserve the exact environment/workload/evidence boundary whenever
  it studies systems languages, scientific Python, or accelerators.
