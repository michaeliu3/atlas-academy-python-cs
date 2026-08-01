# M6–M10 legacy remediation — source brief

**Scope.** Re-audited the five current learner workbooks, their Arc II source
map, and the prior official-source review on **2026-08-01**. Each workbook
already contains the core learner material: six connected sessions,
prediction/tracing, diagnostics, TA and Study Partner handoffs, a project-like
evidence packet, and an oral-defense prompt. This is not a release or
contract-passing claim. In particular, the earlier M8 tombstone concern is
already closed by its five-slot prediction/reveal trace.

The remaining high-value gap is **release-grade source traceability**, not a
missing algorithms topic. Existing source notes are useful narrative reading
lists, but the Arc II map has no per-claim/session access date, reuse state, or
stable claim linkage—the exact fields required by the goal. The smallest
remediation is a compact ledger beside the existing source-map sections; do
not add a new registry or rewrite the workbooks.

| Module | One genuine gap and why it matters | Official calibration relevance | Smallest remediation |
| --- | --- | --- | --- |
| **M6** | The map cites the floating CPython `3.14` branch while the workbook relies on a `v3.14.6` distinction between portable behavior and implementation observation. That prevents a reviewer from tying a resize/layout claim to one stable source. | [MIT 6.006 Lecture 2](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) calibrates the array/list model; [Python’s data model](https://docs.python.org/3.14/reference/datamodel.html) owns object/identity semantics. | Add six session rows with claim IDs; pin implementation rows to `v3.14.6`; record access date, link/cite-only reuse, and the model/Python/CPython boundary. |
| **M7** | The iterator/generator and bounded-pipeline claims are well explained, but no ledger binds Session 2–5 claims to the official iterator, `yield`, and `deque` authority or records that the university material is scope calibration rather than an async/backpressure guarantee. | [Berkeley CS61A’s current iterator/generator discussion](https://cs61a.org/disc/disc06/disc06.pdf) and [Python iterator types](https://docs.python.org/3.14/library/stdtypes.html#iterator-types) support the protocol/tracing route. | Add four claim-linked rows and one explicit non-claim: synchronous pull/buffer reasoning is not a concurrent backpressure result. |
| **M8** | The tombstone trace is now strong, but the authoritative implementation link in the Arc II map still floats on the CPython `3.14` branch. A reviewer cannot reproduce the exact `dict` source observation or distinguish it from the language contract. | [MIT 6.006 Lecture 4](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) calibrates collisions/expected analysis; [Python `__hash__`](https://docs.python.org/3.14/reference/datamodel.html#object.__hash__) owns the equality/hash rule. | Pin the `dictobject.c` reading to `v3.14.6` and add session claim rows for collision, equality/hash, expected cost, and the inverted-index contract. |
| **M9** | The workbook names a pinned `heapq.py` reading, but the Arc II source section does not carry that stable implementation source or connect it to the Session 4 heap/code-reading claims. The result is evidence that exists but is not reviewable from the map. | MIT 6.006’s resource index exposes binary-tree/AVL/heap lectures; [Python `heapq`](https://docs.python.org/3.14/library/heapq.html) is the portable operation authority. | Add a `v3.14.6` `Lib/heapq.py` row and a short Session 4 claim map; retain the existing warning that implementation shape is not a language promise. |
| **M10** | The source notes give exact graph links, but the Arc II map collapses Sessions 2–6 into “Lectures 9–14.” That is too coarse to audit the distinct BFS, DFS, negative-cycle, Dijkstra, and MST claims. | MIT’s [6.006 resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) separately lists Lectures 9–14; [MIT 6.046 MST notes](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/4a7fdddff3bc419c70bb470106a1663a_MIT6_046JS15_lec12.pdf) calibrate the cut/exchange argument. | Add five session rows, each with one exact source, claim scope, access date, and link/cite-only reuse status; no new graph exercise is needed. |

## Implemented batch evidence

The compact remediations were applied in the five existing workbooks and the
existing Arc II source map: each session now names a claim/learner artifact,
one source route, an access date, and a link/cite-only boundary; M6/M8/M9
implementation readings use the stable `v3.14.6` tag; M10 maps its distinct
graph claims to the exact lecture/MST source; and M7 adds the missing
demand/ownership/bounded-memory/failure evidence rubric. This is authoring
traceability only—not human-quality review, learner evidence, a release,
deployment, or promotion of any legacy-baseline lifecycle state.

## Integrity boundary

These sources calibrate topic scope and evidence expectations; they do not
establish university enrollment, grading, staff feedback, credit, a degree, or
equivalent outcomes. Treat all non-Atlas material as **link/cite-only** unless
a current asset-specific license is checked. MIT OCW publishes
[its terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/), but this
brief does not grant reuse of any source material.
