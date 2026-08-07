# M6–M10 official-source review

**Scope.** This is a concise, fresh calibration of the existing Arc II
workbooks, not a content rewrite. The official pages below were checked on
**2026-08-01**. They calibrate topic order, rigor, and kinds of learner
evidence; they do not establish enrollment, staff feedback, assessment/credit
equivalence, a degree, or durable mastery.

| Official public calibration source | What it checks in this review |
| --- | --- |
| [MIT 6.006 resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) | A single algorithms spine: data structures, sorting, hashing, binary trees/AVL/heaps, BFS/DFS, weighted shortest paths, Bellman–Ford, and Dijkstra. |
| [CMU 15-122 current syllabus and learning objectives](https://www.cs.cmu.edu/~15122/syllabus.shtml) | Contracts, invariants, correctness/termination arguments, asymptotic **and** practical efficiency, specification/implementation distinctions, and data-structure manipulations. |
| [Stanford CS106B schedule](https://web.stanford.edu/class/cs106b/schedule.html) | A programming-abstractions sequence containing stacks/queues, arrays/dynamic memory, linked lists, trees/BSTs/heaps, hashing, graphs, and shortest paths. |
| [Georgia Tech CS 1332 syllabus](https://syllabus.gatech.edu/sites/default/files/2026-04/CS1332-SUMMER_Borela-Valente_Rodrigo.pdf) | A current breadth check for arrays, linked lists, stacks/queues/deques, AVL/heaps, maps/hash maps, graphs, sorting, BFS/DFS/Dijkstra/Prim/Kruskal, testing, debugging, and performance. |
| [UC Berkeley CS 61B Spring 2026 calendar](https://sp26.datastructur.es/) | A current project/discussion-oriented sequence for references/lists/arrays, iterators, trees, graph traversal/shortest paths/MSTs/DAGs, hashing/tries, and sorting. |

| Existing Atlas sessions and evidence | Official scope calibration | Judgment and intentional boundary |
| --- | --- | --- |
| **M6 — representation, memory, sequences, linked structures.** Sessions 1–6 move from object/reference diagrams and array indexing through dynamic-array growth, linked RI/AF, locality/retained-memory claims, and a changing-requirements history-buffer defense. Evidence: `MiniDynamicArray`, linked-state traces, source-reading record, and representation decision. | MIT 6.006 Lecture 2 establishes interface/representation, static arrays, linked lists, and dynamic arrays; CMU 15-122 establishes invariant- and cost-based implementation comparison; Stanford, Georgia Tech, and Berkeley all place array/list/reference work before the later structures. | **Aligned, adapted.** Atlas adds Python/CPython claim labels and avoids pretending a Python object graph is C/C++ storage. Manual allocation/deallocation, cache measurement, and deep CPython internals remain later systems work. |
| **M7 — stacks, queues, iteration, lazy computation.** Sessions 1–6 derive FIFO/LIFO constraints, iterator state, generator suspension, ownership at yield boundaries, bounded-buffer/rate reasoning, and a patch-review walkthrough. Evidence: iterator-state trace, no-over-consumption check, pipeline ownership table, backpressure claim, and agent-patch review. | Stanford explicitly sequences stacks and queues; Berkeley schedules iterators/iterables after array/list/reference foundations; CMU’s contract, invariant, tracing, and practical-efficiency expectations support the behavioral-protocol and bounded-buffer reasoning. | **Aligned, adapted.** The iterable/iterator/generator and synchronous demand material is a deliberate Python bridge, not a claim that those university data-structure courses teach an identical lazy-stream system. Async waiting, cancellation, and concurrent backpressure are deferred to later modules. |
| **M8 — hashing, dictionaries, sets, indexing.** Sessions 1–6 derive lookup/indexing, collisions/open addressing, equality/hash stability, expected/amortized costs, a Python-layer inverted index, and recovery/adversarial patch review. Evidence: collision/tombstone paper trace, `CollisionKey` experiment, soundness/completeness argument, index evidence packet, and rejected unsafe patch. | MIT 6.006 Lecture 4 supplies the dynamic-set/collision/expected-cost spine. Georgia Tech names maps/hash maps and testing/debugging; Berkeley schedules hashing twice and a hash-map task. CMU supplies the specification, invariant, and practical-efficiency standard. | **Aligned, adapted.** Atlas makes implementation boundaries unusually explicit and uses an inverted-index artifact rather than a disconnected table implementation. It does not claim worst-case constant time, stable hash values, or that its chained course model describes CPython’s layout. |
| **M9 — trees, heaps, sorting, ordered data.** Sessions 1–6 select structures from ordered questions, derive BST/AVL invariants and rotation, connect heap representation to priority selection, distinguish sorting/trie contracts, then coordinate index/scheduler evidence and patch review. Evidence: decision ledger, rotation proof sketch, heap trace, comparison memo, scheduler/trie architecture defense. | MIT 6.006 sequences sorting, linear sorting, binary trees/AVL, and heaps. Stanford and Georgia Tech cover linked structures, BSTs, heaps, sorting, and graphs; Berkeley’s current calendar covers trees/BSTs, hashing/tries, and sorts. | **Aligned, adapted.** Atlas emphasizes reading, invariant recovery, and selection from client operations over full production implementations of every tree. 2–4/LLRB/B-tree families and database-index engineering are intentional depth extensions. |
| **M10 — graph algorithms, network models.** Sessions 1–6 progress from graph contract/representation to BFS, DFS/topological evidence, relaxation/DAG/Bellman–Ford, Dijkstra’s finalization condition, and MST/forest reasoning. Evidence: graph-question sheet, independently checked path/cycle/order witnesses, negative-cycle diagnostic, stale-heap trace, forest trace, and planner oral defense. | MIT 6.006’s contiguous sequence covers BFS, DFS, weighted paths, Bellman–Ford, and Dijkstra; Berkeley currently schedules graph traversal, shortest paths, MSTs, and DAGs; Georgia Tech names BFS/DFS/Dijkstra/Prim/Kruskal; Stanford schedules graphs and shortest paths. | **Aligned, adapted.** Atlas’s six-session path keeps algorithm selection tied to stated graph assumptions and evidence verification. Johnson/all-pairs, maximum flow, network routing protocols, and high-volume graded implementation practice are intentionally outside this module. |

## Connected finding

The route is coherent rather than a survey: representation and costs (M6)
constrain access and retained state (M7); indexing (M8) contrasts with ordered
questions (M9); queues, stacks, maps/sets, heaps, and disjoint sets then become
visible, noninterchangeable roles in graph state machines (M10). That sequence
is compatible with the MIT 6.006 spine and the course coverage checked at CMU,
Stanford, Georgia Tech, and Berkeley.

The main adaptation is assessment, not a claim of lower conceptual rigor:
Atlas uses prediction, code reading, debugging, design review, artifacts, and
a constructive oral defense where institutionally staffed courses use much
larger volumes of timed/graded programming work. Learner artifacts can support
evidence of understanding; they cannot substitute for university enrollment,
staff review, or credentials.

## Reuse boundary

All five sources are **link/cite-only calibration sources** for Atlas. Keep
Atlas explanations, diagrams, code, prompts, diagnostics, and projects
original. Do not copy course prose, figures, assignments, solutions, exam
items, or protected course-specific materials. MIT OCW publishes
[its current terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) and
uses CC BY-NC-SA 4.0 for OCW material, but this review makes no reuse grant:
check the current license and each asset before any use beyond linking or a
brief attributed paraphrase.
