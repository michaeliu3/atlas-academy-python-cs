# Module 19 — Concurrency and Parallelism — Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** source ownership, claim linkage, reuse decisions, evidence limits,
and known structural omissions for the existing M19 workbook, Arc Four
concurrency surface, and bounded reference model. This is an
instructor-facing audit record, not learner-facing textbook copy, a quality
approval, or a publication decision. It is an **authoring-only** record, not a
public learner download or release-evidence-policy artifact. A non-promoting
structural packet may make it a hashable internal release input; that
mechanical inclusion is not a learner delivery, quality approval, publication,
or release-evidence claim.

## Verdict

M19 has a coherent source spine when each source class keeps its own job:

- official Python 3.14.6 documentation owns public API and runtime-version
  claims;
- Harmony owns a finite-model and counterexample-reading vocabulary;
- OSTEP and the university sequence checks own pedagogical progression and
  systems intuition, not Python contracts;
- POSIX owns narrowly scoped synchronization vocabulary, not Python's language
  memory model; and
- the Atlas reference model owns only the behavior of its finite, named test
  fixtures.

The central lesson is not “add a lock” or “the GIL makes it safe.” It is to
recover state, owners, transitions, invariants, and evidence boundaries before
choosing a primitive. A documented lock call, a model-checker trace, an
observed scheduling outcome, a passing test, and a production-level correctness
claim are different propositions.

Use original Atlas prose, diagrams, schedules, traces, code-reading prompts,
diagnostics, and exercises. Link to external material and paraphrase it. Do
not copy substantial university lectures, assessments, figures, solutions,
standard text, documentation prose, or source-code excerpts. This addendum
gives a later structural candidate source/reuse pointers; it does **not**
change the legacy-audit status, human-quality-review state, release evidence,
availability, or publication state of M19.

## Audit basis and access record

The canonical map is
[`module19_concurrency_parallelism_source_map.md`](module19_concurrency_parallelism_source_map.md).
It records an access snapshot of 2026-07-29 and the full source-to-session
teaching architecture. This addendum rechecked its highest-value reuse facts
on 2026-07-30: the Python 3.14 license page, the Harmony book license, and
OSTEP's direct-link instruction.

| Audit fact | Evidence | Consequence |
| --- | --- | --- |
| Canonical source-map delivery mirror | `content/source-maps/module19_concurrency_parallelism_source_map.md` is the canonical map; `public/downloads/module19_concurrency_parallelism_source_map.md` is the allowlisted learner-facing copy. | A release review must repeat deterministic copy/hash checks after either path changes. Equality does not approve the map's claims. |
| Python runtime/documentation target | The canonical map and workbook scope public API statements to Python 3.14.6. The [Python license page](https://docs.python.org/3.14/license.html) identifies PSF License Version 2 and dual 0BSD licensing for documentation examples/recipes/code from Python 3.8.6 onward. | Keep every API and runtime statement version-scoped; preserve applicable notices for any exact imported asset. Original examples remain the default. |
| Harmony book reuse | The [Harmony book](https://harmony.cs.cornell.edu/book/) displays CC BY-NC-SA 4.0 terms. | Prefer original models and diagrams. Any adaptation requires attribution, noncommercial and share-alike analysis, an exact asset record, and a human reuse check. |
| OSTEP reuse | The [OSTEP site](https://pages.cs.wisc.edu/~remzi/OSTEP/) asks instructors to link directly to the online chapters rather than copy them. | Link and paraphrase only; do not host chapters, figures, preparation notes, homework, or solutions. |
| Bounded local model | `public/downloads/module19_reference.py` and `public/downloads/test_module19_reference.py` are tracked teaching downloads. | Their result is a finite Atlas model/test result, not a scheduler guarantee, CPython implementation proof, deadlock-freedom proof, performance claim, or production-concurrency guarantee. |

## Source and reuse ledger

The source map contains the full primary-source index and detailed claim
ledger. This shorter audit table names the source families a later reviewer
must keep separate. “Link and paraphrase” remains the default distribution
decision; public availability does not grant permission to embed an asset.

| ID | Owner/source and stable learner-facing link | Claim linkage | Reuse decision |
| --- | --- | --- | --- |
| **P19-sync** | Python Software Foundation: [`threading`](https://docs.python.org/3.14/library/threading.html), [`queue`](https://docs.python.org/3.14/library/queue.html), [`concurrent.futures`](https://docs.python.org/3.14/library/concurrent.futures.html), [`multiprocessing`](https://docs.python.org/3.14/library/multiprocessing.html), and [free-threading HOWTO](https://docs.python.org/3.14/howto/free-threading-python.html) | Sessions 1–5: public primitive behavior, queue accounting, executor cancellation, process boundaries, GIL/free-threaded distinctions, and lifecycle warnings. | PSF License Version 2; documentation examples/recipes/code additionally 0BSD from 3.8.6. Link and use original examples by default. If exact material is reused, retain notices, record the exact version/asset, and inspect incorporated third-party notices. |
| **P19-diagnostics** | Python Software Foundation: [`faulthandler`](https://docs.python.org/3.14/library/faulthandler.html) and [`sys._current_frames`](https://docs.python.org/3.14/library/sys.html#sys._current_frames) | Sessions 4–6: bounded hang evidence, stack snapshots, and diagnostic stopping lines. | Link and paraphrase. A stack snapshot is evidence at one instant, not an explanation of all histories or a cure for a hang. |
| **P19-PEP** | Python Enhancement Proposals: [PEP 703](https://peps.python.org/pep-0703/), [PEP 779](https://peps.python.org/pep-0779/), [PEP 684](https://peps.python.org/pep-0684/), and [PEP 734](https://peps.python.org/pep-0734/) | Session 5: version/build/runtime boundaries for free-threaded builds, isolated interpreters, and implementation choices. | Link and paraphrase, naming the exact PEP/status/version. Do not turn a PEP into an application locking or performance guarantee. |
| **C19-source** | CPython 3.14.6 pinned library source: [`queue.py`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/queue.py), [thread executor](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/concurrent/futures/thread.py), and [process executor](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/concurrent/futures/process.py) | Sessions 2–5: code-reading architecture, accounting roles, and public-abstraction boundaries. | Link to the pin and quote only minimal necessary lines with attribution/notices. Do not treat implementation details as portable Python semantics. |
| **U19-Harmony** | Cornell authors, [Harmony book and tool](https://harmony.cs.cornell.edu/book/) | Sessions 1–4: possible schedules, critical sections, waiting, deadlock, bounded model checking, and counterexample traces. | CC BY-NC-SA 4.0 for the book. Link/paraphrase/original assets by default. A finite model explores only the supplied finite model; it is not a proof of every Python execution. |
| **U19-OSTEP** | Arpaci-Dusseau authors, [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/) | Sessions 1–4: concurrency intuition, locks, condition variables, semaphores, and bug classes. | Link and paraphrase only. The site requests direct linking; do not copy chapters, figures, homework, code, or solutions. |
| **U19-sequence** | [Cornell CS 4410/5410](https://www.cs.cornell.edu/courses/cs4410/2026sp/), [Oxford Concurrent Programming](https://www.cs.ox.ac.uk/teaching/courses/2025-2026/concurrentprogramming/), and [Stanford CS111](https://web.stanford.edu/class/cs111/) | Whole-module dependency order and breadth check: schedules → locks → stateful abstraction → waiting → deadlock → evidence. | Link and paraphrase only. These course pages do not authorize copying notes, labs, exams, assignments, figures, or solutions. |
| **P19-POSIX** | IEEE/The Open Group, [POSIX Issue 8 synchronization](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html) and [condition wait](https://pubs.opengroup.org/onlinepubs/9799919799/functions/pthread_cond_wait.html) | Sessions 2–4: carefully bounded vocabulary for synchronization, waiting, visibility/order, and why timing folklore is not a contract. | Link and paraphrase only. Do not claim that Python adopts the POSIX/C memory model wholesale. |
| **A19-model** | Atlas bounded reference model and tests in `public/downloads/module19_reference.py` and `public/downloads/test_module19_reference.py` | Sessions 1–6: schedule, lifecycle, ownership, and evidence questions within named fixtures. | Original course artifact. Keep it finite and deterministic; do not label fixture behavior as external runtime, process, network, or production-system evidence. |

## Six-session claim linkage

This table maps the course's connected sessions to sources that can support the
lesson. It is a structural authoring aid, not a human review of workbook or
studio quality.

| Session | First-principles question | Sources that may support the lesson | Required stopping line / counterexample |
| --- | --- | --- | --- |
| **1 — A second worker creates histories** | Which state transitions and schedules can produce one observed result? | `U19-Harmony`, `U19-OSTEP`, `P19-sync`, `A19-model` | A source expression or a zero-error run is not necessarily one indivisible semantic transition. A finite schedule trace is not a statement about every runtime schedule. |
| **2 — Protect one logical transition** | What whole semantic transition—not merely which line—must appear indivisible? | `U19-Harmony`, `U19-OSTEP`, `P19-sync`, `P19-POSIX` | Documented lock methods do not make arbitrary read–check–write sequences atomic; do not substitute GIL folklore or bytecode claims for an invariant. |
| **3 — Predicates, permits, and item ownership** | Which owner and predicate make bounded work/result queues accountable? | `P19-sync`, `C19-source`, `U19-Harmony` | Queue size snapshots are not authorization. A notification is not remembered state; `task_done()`/`join()` accounting does not prove all work completed after immediate shutdown. |
| **4 — Progress can fail** | Which wait-for or lifecycle dependency prevents progress, and what evidence can distinguish it? | `U19-Harmony`, `U19-OSTEP`, `P19-diagnostics`, `P19-POSIX` | A timeout or one completed run is not deadlock-freedom. A stack capture is one observation point, not a universal history. |
| **5 — Choose the Python execution model from first principles** | How do shared-memory, serialization, cancellation, build, and workload boundaries alter the right execution model? | `P19-sync`, `P19-PEP`, `C19-source` | Threads, processes, interpreters, and pools are not interchangeable; the GIL/free-threaded state is not an application correctness proof or a universal performance explanation. |
| **6 — Atlas multi-worker evidence defense** | Which evidence can support a bounded concurrency claim, and which claims remain open? | `A19-model`, all preceding IDs, `U19-sequence` | A passing fixture, forced schedule, stress run, or speed measurement needs its exact model/workload/runtime scope. It cannot establish distributed exactly-once, network behavior, crash recovery, or learner mastery. |

## Evidence language and reuse controls

| Evidence label | It can establish | It cannot establish by itself |
| --- | --- | --- |
| **Python 3.14 API contract** | The named public API/version's documented behavior. | A compound application invariant, fairness, a remote effect, or a different Python implementation/build. |
| **CPython source or PEP** | A named implementation/design detail under its exact commit or PEP status. | A portable language contract, an application lock, or a measured performance cause. |
| **Harmony/finite model** | A possible path or result for the supplied finite model. | A proof about all inputs, OS schedules, CPython builds, failures, or the full Atlas program. |
| **University reading** | Instructional sequence, terminology, and systems intuition. | A Python specification or a license for every linked asset. |
| **POSIX standard** | Scoped POSIX synchronization semantics and terminology. | A claim that Python has the POSIX/C memory model. |
| **Atlas reference/test result** | The named local fixture's behavior in its stated environment. | Production correctness, deadlock-freedom, security, scalability, or learner mastery. |
| **AI proposal** | A candidate design, trace, explanation, patch, or test to inspect. | Source authority, correct invariant, provenance, or permission to reuse material. |

1. Create original teaching assets. Do not import textbook figures, course
   slides, assignments, exam questions, solutions, or unreviewed code.
2. Preserve source class in diagrams and prose: model trace, documented API,
   CPython observation, Atlas policy, measurement, and hypothesis must not
   blur into one claim.
3. Recheck volatile runtime facts before release: exact Python version, PEP
   status, free-threaded build availability, multiprocessing defaults, and
   course-page licensing/reuse notices.
4. Keep the bounded reference model away from uncontrolled threads, network
   access, subprocesses, arbitrary file effects, and claims about real
   schedulers. A source/test pointer is not a safety certification.

## Unresolved Study Partner route

The canonical M19 legacy audit records `study-partner-prompt` as **missing**.
This heading is an explicit structural record of that absence, not a substitute
prompt. A module-specific Study Partner prompt is missing. The generic
`/learning-partners` package may remain a useful general startup resource, but
it must not be used to claim that M19 has a Study Partner, a module-specific
handoff, or complete support evidence.

Before an M19 Study Partner criterion can change state, author and review a
module-specific prompt that rehearses schedule prediction, invariant naming,
counterexample repair, bounded code reading, transfer to M20/M21/M24, and a
learner-controlled handoff. Then attach the reviewed artifact and its evidence
without changing an audit status merely because a generic package exists.

## Release-truth checks and unresolved provenance

The following are required before a later M19 approval claim. None is
satisfied merely because this addendum or a structural packet exists.

| Check | Current audit observation | Required action before an approval claim |
| --- | --- | --- |
| **Source freshness** | Python 3.14.6, free-threading/PEP status, and university course pages are versioned or living material. | Recheck direct URLs, version/build, PEP status, access dates, and license/reuse notices at review time. |
| **Source linkage in learner-visible material** | The source map is detailed, but resolving an anchor does not prove every workbook/studio statement carries the correct source class and stopping line. | Review visible claims, diagrams, traces, and prompts against the source map session by session. |
| **Study Partner support** | The module-specific prompt remains missing. | Keep the criterion missing until a named prompt and human review exist; do not substitute the generic package. |
| **Reference-model boundary** | The public downloads are useful finite teaching artifacts, not a scheduler or production-system model. | Run declared tests, inspect imports/effects, record command/environment/results, and retain the finite-model limitation. |
| **Human quality/accessibility review** | The legacy audit still marks rigor, code/debug/design, visual/text, diagnostic/misconception, and oral-defense evidence ambiguous. | Preserve those statuses until qualified review checks the learner experience and records evidence. |
| **Asset/reuse review** | This addendum authorizes no non-original external asset import. | Inventory every shipped non-original asset and retain attribution/notices where reuse is actually approved. |

## Evidence language to carry into M20–M24

- **Synchronization contract:** a scoped primitive/API property, not an
  application invariant or a remote/distributed guarantee.
- **Finite schedule/model:** a path through the declared model, not all real
  executions.
- **CPython/PEP fact:** a named build/version/design statement, not portable
  Python or a performance conclusion.
- **Atlas result:** a bounded local model/test outcome, not durability,
  network, security, or distributed exactly-once evidence.
- **AI proposal:** a useful candidate to challenge with an invariant,
  counterexample, source boundary, and test—not an authority.

M20 must add remote/evidence scope; M21 must establish asynchronous and
distributed coordination; M24 must establish interpreter/runtime attribution.
M19 should leave those topics visibly unresolved rather than borrowing their
authority from a lock call, a GIL slogan, a finite model, or a passing test.
