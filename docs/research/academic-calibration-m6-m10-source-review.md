# Academic calibration — M6–M10 source review

## Scope, method, and truth boundary

This is a targeted review of the Arc II workbooks for [M6: Representation,
Memory, Sequences, and Linked Structures](../../content/modules/06_representation_memory_sequences_linked.md),
[M7: Stacks, Queues, Iteration, and Lazy Computation](../../content/modules/07_stacks_queues_iteration_lazy.md),
[M8: Hashing, Dictionaries, Sets, and Indexing](../../content/modules/08_hashing_dictionaries_sets_indexing.md),
[M9: Trees, Heaps, Sorting, and Ordered Data](../../content/modules/09_trees_heaps_sorting_ordered.md),
and [M10: Graph Algorithms and Network Models](../../content/modules/10_graph_algorithms_network_models.md).
It also reviews the existing [Arc II source map](../../content/source-maps/arc_ii_source_map.md).

The comparison uses official university course pages, schedules, and open
materials accessed on **2026-08-01**. It evaluates conceptual coverage,
dependency order, and the kinds of evidence the workbooks ask a learner to
produce. It does **not** claim enrollment, faculty or peer feedback, contact
hours, assessment equivalence, credit, certification, a degree, or durable
mastery equivalent to any institution.

## Official calibration corpus

| Institution and official material | What it contributes to this review |
| --- | --- |
| MIT [6.006 Lecture 2: Data Structures](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec2/), [Lecture 4: Hashing](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-4-hashing/), and [resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) | A rigorous undergraduate algorithms spine: interfaces and representations, dynamic arrays, hashing, ordered structures, BFS/DFS, weighted shortest paths, and graph-algorithm problem solving. |
| Carnegie Mellon [15-122: Principles of Imperative Computation](https://www.cs.cmu.edu/~15122/syllabus.shtml) | Learning objectives connect contracts, invariants, proofs, code tracing, asymptotic and empirical reasoning with arrays, stacks/queues, hash tables, priority queues, balanced trees, disjoint sets, and graph algorithms. |
| Stanford [CS106B schedule](https://web.stanford.edu/class/cs106b/schedule.html) and archived [Graph Algorithms lecture](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1244/lectures/24-graphs/) | A cohesive programming-abstractions sequence: stacks/queues, sets/maps, sorting, pointers/arrays, linked lists, trees, heaps, hashing, graph representations, traversals, shortest paths, and MSTs. |
| Georgia Tech [CS 1332: Data Structures & Algorithms syllabus](https://syllabus.gatech.edu/sites/default/files/2026-04/CS1332-SUMMER_Borela-Valente_Rodrigo.pdf) | A current scope cross-check listing arrays, linked lists, stacks/queues/deques, BSTs/AVLs/heaps, maps/hash maps, graphs, sorting, BFS/DFS/Dijkstra/Prim/Kruskal, performance, testing, and debugging. |
| UC Berkeley [CS 61B Spring 2026 course calendar](https://sp26.datastructur.es/) and [official course catalog description](https://www2.eecs.berkeley.edu/Courses/CS61B/) | A current course sequence that pairs lists/references/resizing, iterators, ordered trees/heaps, graph traversal/shortest paths/MSTs/DAGs, hashing/tries, and sorting with projects and discussions. |

The sources are calibration references, not a repository of text, diagrams,
assignments, solutions, or assessment items to copy. In particular, the
Stanford schedule explicitly protects its course materials. MIT OCW has a
[CC BY-NC-SA 4.0 license](https://live.ocw.mit.edu/pages/privacy-and-terms-of-use/),
but any reuse rather than linking/paraphrase still needs attribution,
non-commercial and share-alike compliance, and asset-level checking. Treat
the public CMU, Stanford, Georgia Tech, and Berkeley materials as linked
reference sources unless a specific reuse license is verified.

## Material-level calibration

| Atlas module | Official material checked | Alignment, adaptation, and remaining boundary |
| --- | --- | --- |
| **M6 — representation, memory, sequences, and linked structures** | MIT 6.006 Lecture 2 establishes the sequence-interface, static-array, linked-list, dynamic-array, and operation-cost bridge. CMU 15-122 expects learners to reason with representation invariants, compare implementations, and trace imperative code. Stanford CS106B schedules arrays/dynamic memory, linked lists, trees, and heap representations; Georgia Tech CS1332 and Berkeley CS61B similarly make arrays, linked lists, and resizing core material. | Atlas is strongly aligned on interface-before-representation, array versus linked tradeoffs, amortized growth, RI/AF, code traces, and qualified memory claims. It deliberately uses Python object graphs and pinned CPython reading rather than C/C++/Java pointer ownership and manual deallocation. That is an appropriate language adaptation; systems-level allocation, caches, and CPython internals remain explicitly forward-linked rather than being overclaimed here. |
| **M7 — stacks, queues, iteration, and lazy computation** | MIT 6.006 Lecture 2 and Stanford CS106B both frame stacks and queues as restricted interfaces with operation-driven representation choices. Berkeley CS61B's current calendar separately teaches iterators/iterables after arrays, lists, and resizing. | Stack/queue laws, `deque` selection, iterator state, generator traces, bounded buffers, and demand reasoning form a coherent continuation of M6. The generator/lazy-pipeline and synchronous backpressure portions are an Atlas/Python adaptation, not a claim that the cited data-structure courses provide the same systems treatment. The workbook correctly defers concurrent waiting, cancellation, and asynchronous backpressure to later modules. |
| **M8 — hashing, dictionaries, sets, and indexing** | MIT 6.006 Lecture 4 supplies the dynamic-set, collision, expected-cost, and hashing analysis spine. CMU 15-122 lists hash tables and contracts/invariants; Georgia Tech CS1332 lists maps/hash maps; Berkeley CS61B's current sequence includes two hashing sessions and a hash-map coding task. | Atlas aligns on the operation family, collisions, equality/hash contract, load factor, expected versus worst-case reasoning, resizing, and a realistic inverted-index artifact. It appropriately distinguishes Python language behavior, CPython observations, and textbook models. The intentionally small manual implementation uses chaining and no deletion, so open-addressing deletion remains a conceptual rather than executable trace. |
| **M9 — trees, heaps, sorting, and ordered data** | MIT 6.006 lectures cover set/sorting tradeoffs, linear sorting assumptions, trees, balanced-tree ideas, and heaps. Stanford and Berkeley sequences cover linked structures, BSTs, tree traversals, priority queues/heaps, hashing, and sorting. Georgia Tech CS1332 explicitly names BSTs, AVLs, heaps, and several sorting families. | Atlas meets the central standard through ordered-query selection, BST/AVL/heap invariants, rotations, stability and ordering distinctions, code reading, and cost-aware design. Its choice to reveal one rotation and heap repair rather than demand a production balanced-tree implementation is a defensible understanding-first adaptation. B-trees/LLRBs/2-4 trees and database indexes remain depth extensions, not missing claims for this module. |
| **M10 — graph algorithms and network models** | MIT 6.006's graph sequence covers BFS, DFS, weighted paths, Bellman–Ford, Dijkstra, and all-pairs composition. Stanford's graph lecture connects representation, DFS/BFS, MSTs, topological order, and shortest paths. Georgia Tech CS1332 and Berkeley CS61B both explicitly sequence BFS, DFS, Dijkstra, Prim, Kruskal, shortest paths, MSTs, and DAGs. | Atlas is aligned on explicit graph contracts, representation choices, BFS/DFS invariants, topological evidence, relaxation, Bellman–Ford, Dijkstra preconditions, and Prim/Kruskal cut reasoning. Its code-reading and oral-defense orientation deliberately substitutes for the volume of institutionally graded implementation problems. Johnson/all-pairs material is correctly a bounded transfer reading rather than compressed into a sixth session. |

## Cross-module finding

The M6→M10 dependency chain is unusually coherent for an accelerated route:
representation and cost (M6) constrain frontier behavior and cursor state (M7);
indexing (M8) contrasts identity-based lookup with ordered queries (M9); and
M7 queues, M8 maps/sets, and M9 heaps become visible components of M10 graph
algorithms. That dependency order is consistent with the progression visible
in MIT 6.006, Stanford CS106B, Georgia Tech CS1332, and Berkeley CS61B.

The strongest Atlas distinction is intentional: it gives more weight to
prediction, invariant recovery, debugging, architecture review, agent-patch
critique, and constructive oral defense than to high-volume timed coding. CMU
15-122's published objectives support the importance of contracts, invariants,
proofs, tracing, and empirical checks; they do not make this alternative
assessment style institutionally equivalent.

## Recommended next revision priority

**P1 — add a compact, session-addressable Arc II source ledger, not another
registry.** The existing arc map is a strong module-level source map, but it
does not yet make all thirty M6–M10 sessions independently auditable. Add one
small six-row-per-module table to the existing map (or derive it from an
existing contract): session, one bounded official source, Atlas artifact, and
`aligned`/`adapted`/`deferred` status. This makes the current calibration
usable without multiplying metadata files.

**P2 — make one M8 open-addressing deletion trace executable on paper.** Keep
the chained mini-map as the only manual implementation, but add a short
prediction-and-repair trace showing why a tombstone (or equivalent state) is
needed after deletion in an open-addressed table. That directly closes the gap
between the conceptual comparison and the collision/deletion reasoning
emphasized by MIT, Georgia Tech, and Berkeley, without expanding M8 into a
second implementation lab.

**P3 — add one cumulative M6→M10 architecture-reading dossier.** Use a small
Atlas slice in which a dynamic record sequence feeds a queue/iterator, an
inverted index, a priority scheduler, and a prerequisite graph. Require the
learner to name the contract, representation invariant, resource model, and
failure boundary at each handoff. This preserves the understanding-first
philosophy while providing the sustained integration practice that full
university courses usually obtain through projects, problem sets, and staff
feedback.

## Reuse and integrity note

Atlas should keep writing original explanations, diagrams, prompts,
diagnostics, code traces, and artifacts. Link to official lectures or
exercises only after checking their current access and reuse terms; do not
republish protected course content or solutions. The material reviewed here
supports an honest calibration of scope and evidence expectations, not a claim
that Atlas reproduces university teaching conditions or credentials.
