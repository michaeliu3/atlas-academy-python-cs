# Arc II Source Map — Data Structures and Algorithms

## Why this map exists

This is the instructor's source audit for Modules 6–11. It keeps the course current and rigorous without turning Michael's learning path into a pile of external links.

External sources serve three different roles:

1. **University sequence:** supplies conceptual scope, prerequisite expectations, and problem traditions.
2. **Official Python source:** settles language and standard-library behavior for Python 3.14.
3. **Implementation or exercise source:** supports code reading, investigation, and transfer.

The course narrative is original and dependency-ordered. We link rather than copy assignments, respect source licenses, and verify Python claims against current official documentation.

**Access and reuse record.** The linked sources in the Arc II recheck were
verified on **2026-08-01**. They are link/cite-only calibration and lookup
sources: Atlas retains its own explanations, diagrams, code, prompts, and
diagnostics. Do not reproduce course prose, figures, assignments, solutions,
or course-specific assessments. A Python language reference supports portable
behavior; a pinned CPython path supports only the named implementation
observation; a university page calibrates scope and evidence expectations.

## Arc-level anchor

[MIT 6.006 Introduction to Algorithms, Spring 2020](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) is the primary university spine. Its prerequisites explicitly include Python programming plus the discrete mathematics covered in our Arc I. Its sequence connects data structures, graph algorithms, dynamic programming, correctness, and performance analysis.

Useful whole-course entry points:

- [syllabus and prerequisites](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/);
- [lecture and recitation notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/);
- [resource index with problem sets and solutions](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/);
- [lecture videos](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-videos/).

**What we import:** interface-first modeling, explicit operation costs, mathematical correctness, recitation-style problem solving, and cumulative algorithmic reasoning.

**What we adapt:** the original course is assessment-heavy and compresses material for an institutionally supported semester. Our route expands hidden prerequisites, uses Atlas as one continuous system, and replaces much timed implementation with code reading, debugging, design, agent direction, and oral defense.

## Module-by-module audit

### Module 6 — Representation, memory, sequences, and linked structures

| Source | Role in our module |
|---|---|
| [MIT 6.006 Lecture 2: Data Structures and Dynamic Arrays](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-2-data-structures-and-dynamic-arrays/) | Establishes the distinction between an interface and a data structure; develops sequence/set operations, static arrays, linked lists, and dynamic arrays. |
| [Python 3.14 data model](https://docs.python.org/3.14/reference/datamodel.html) | Canonical basis for objects, identity, type, value, mutability, and references at the language level. |
| [Python 3.14 built-in sequence types](https://docs.python.org/3.14/library/stdtypes.html#sequence-types-list-tuple-range) | Defines the public behavior of lists, tuples, ranges, and common sequence operations. |
| [`sys.getsizeof`](https://docs.python.org/3.14/library/sys.html#sys.getsizeof) and [`tracemalloc`](https://docs.python.org/3.14/library/tracemalloc.html) | Supports careful experiments about shallow size and traced allocations, including their limitations. |
| [CPython `v3.14.6` `listobject.c`](https://github.com/python/cpython/blob/v3.14.6/Objects/listobject.c) | A bounded implementation-reading lab for allocation, resizing, and list operations; it is not a Python language contract. |

**Synthesis decisions**

- Start with bits/bytes only far enough to explain addresses, references, layout, and why representation consumes space.
- Derive a dynamic array and linked structure as course models before reading `list`.
- Treat cache locality as a systems preview, not as a magical constant-factor slogan.
- Explicitly separate Python's object model, CPython's object layout, and textbook diagrams.
- Use an Atlas history buffer to compare workloads rather than asking for disconnected list implementations.

**Claims we will not make**

- `id(x)` is not universally taught as a raw memory address.
- `sys.getsizeof` is not total retained size.
- CPython's current growth formula is not a Python language guarantee.
- Linked lists are not declared “better for insertion” without including the cost of locating the insertion point and real memory behavior.

### Module 7 — Stacks, queues, iteration, and lazy computation

| Source | Role in our module |
|---|---|
| [CS 61A Summer 2026 Discussion 5: Iterators and Generators](https://cs61a.org/disc/disc05/disc05.pdf) | Term-sensitive university exercise route for iterator consumption, infinite streams, and generator tracing; recheck the link and topic before a later review or release claim. |
| [Composing Programs: Iterators](https://www.composingprograms.com/pages/42-implicit-sequences.html) | Conceptual bridge from sequence abstraction to implicit/lazy sequences. |
| [Python 3.14 data model — iterator types](https://docs.python.org/3.14/reference/datamodel.html#iterator-types) | Canonical iterable/iterator protocol. |
| [Python 3.14 expressions — generator expressions and `yield`](https://docs.python.org/3.14/reference/expressions.html#yield-expressions) | Precise suspension, retained state, resumption, delegation, and finalization semantics. |
| [Python 3.14 `collections.deque`](https://docs.python.org/3.14/library/collections.html#collections.deque) | Official queue/deque behavior and the contrast with inefficient front operations on lists. |
| [Python 3.14 `collections.abc`](https://docs.python.org/3.14/library/collections.abc.html) | Names the behavioral interfaces used to distinguish iterable, iterator, sequence, and collection. |

**Synthesis decisions**

- Derive stack and queue interfaces by restricting sequence access.
- Connect the call stack backward to recursion and forward to DFS.
- Treat iteration as a pull protocol with state, not as syntax sugar to memorize.
- Connect laziness to a bounded-memory architectural question, while showing that a lazy source alone cannot guarantee bounded memory or enforce backpressure.
- Keep asynchronous iteration for Module 21; this module establishes the synchronous mechanism it depends on.

**Claims we will not make**

- An iterable is not necessarily an iterator.
- An iterator is not assumed replayable, finite, sized, or indexable.
- A generator does not guarantee bounded memory if downstream stages retain all outputs.
- A synchronous bounded queue simulation is not described as a complete concurrent backpressure system.

### Module 8 — Hashing, dictionaries, sets, and indexing

| Source | Role in our module |
|---|---|
| [MIT 6.006 Lecture 4: Hashing](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-4-hashing/) | Derives hashing from the dynamic-set lookup problem and covers comparison limits, hash functions, collisions, and expected performance. |
| [MIT 6.006 Lecture 4 notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec4/) | Formal definitions and analysis reference. |
| [Python 3.14 data model — `__eq__` and `__hash__`](https://docs.python.org/3.14/reference/datamodel.html#object.__hash__) | Canonical equality/hash contract, mutability cautions, and hash randomization notes. |
| [Python 3.14 mapping types](https://docs.python.org/3.14/library/stdtypes.html#mapping-types-dict) | Public `dict` semantics, key equivalence, insertion order, views, and operations. |
| [Python 3.14 set types](https://docs.python.org/3.14/library/stdtypes.html#set-types-set-frozenset) | Public set/frozenset behavior and set algebra. |
| [CPython `v3.14.6` `dictobject.c`](https://github.com/python/cpython/blob/v3.14.6/Objects/dictobject.c) | Bounded code reading for a real implementation after the course model is understood; it is not a Python language contract. |

**Synthesis decisions**

- Begin with repeated linear scans in Atlas search.
- Treat a hash table as “route to a small candidate region, then use equality,” never as direct magic lookup.
- Model collisions explicitly and distinguish worst, expected, and amortized claims.
- Derive the equality/hash law from equivalence-class consistency.
- Build an inverted index because it connects dictionaries, sets, tokenization boundaries, stale-state risks, and realistic search.

**Claims we will not make**

- Hash-table operations are not unconditionally worst-case \(O(1)\).
- Hash values are not stable persistent IDs.
- Python set iteration order is not an application contract.
- A textbook chained table is not CPython's internal layout.
- Hash randomization is not a complete defense against untrusted-input resource attacks.

### Module 9 — Trees, heaps, sorting, and ordered data

| Source | Role in our module |
|---|---|
| [MIT 6.006 Lecture 3: Sets and Sorting](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-3-sets-and-sorting/) | Ordered versus unordered set operations, comparison sorting, and operation tradeoffs. |
| [MIT 6.006 Lecture 5: Linear Sorting](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-5-linear-sorting/) | Shows how additional key assumptions can escape comparison-sorting bounds. |
| [MIT 6.006 Lectures 6–8 in the lecture-note index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/) | Binary search trees, AVL balancing ideas, and binary heaps. |
| [Python 3.14 `heapq`](https://docs.python.org/3.14/library/heapq.html) | Public heap operations and priority-queue implementation patterns. |
| [Python 3.14 `bisect`](https://docs.python.org/3.14/library/bisect.html) | Ordered-array search and the crucial distinction between logarithmic search and linear insertion. |
| [Python Sorting HOWTO](https://docs.python.org/3.14/howto/sorting.html) | Stable sorting, key functions, and practical composition of ordering requirements. |
| [CPython `v3.14.6` `Lib/heapq.py`](https://github.com/python/cpython/blob/v3.14.6/Lib/heapq.py) | Bounded Session 4 call-path reading for sift/heapify mechanics; helper shape is versioned implementation evidence, not a portable heap guarantee. |

**Synthesis decisions**

- Introduce each structure only through an ordered question hashing cannot answer.
- Reconnect tree recursion to Module 2 and representation invariants to Module 3.
- Use the heap's implicit array representation to reconnect locality and indexing from Module 6.
- Separate a priority queue interface from a heap representation.
- Study tries only for prefix-shaped keys and avoid presenting them as universally superior.

**Claims we will not make**

- A binary search tree is not automatically balanced.
- A heap is not a sorted sequence.
- Binary search does not make insertion into an array logarithmic.
- Stability, total ordering, and key extraction are not interchangeable ideas.

### Module 10 — Graph algorithms and network models

| Source | Role in our module |
|---|---|
| [MIT 6.006 Lecture 9: Breadth-First Search](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-9-breadth-first-search/) | Graph representations, adjacency, paths, shortest-path trees, and BFS. |
| [MIT 6.006 Lecture 10: Depth-First Search](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-10-depth-first-search/) | Session 3 source for DFS finishing state, cycle evidence, and topological ordering. |
| [MIT 6.006 Lecture 11: Weighted Shortest Paths](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-11-weighted-shortest-paths/) and [Lecture 12: Bellman–Ford](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-12-bellman-ford/) | Session 4 sources for relaxation, graph restrictions, negative-cycle evidence, and qualified cost claims. |
| [MIT 6.006 Lecture 13: Dijkstra](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-13-dijkstra/) | Session 5 source for nonnegative-edge finalization and priority-frontier reasoning. |
| [MIT 6.046J Lecture 12: Minimum Spanning Tree](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/4a7fdddff3bc419c70bb470106a1663a_MIT6_046JS15_lec12.pdf) | Session 6 source for cut/exchange reasoning, Kruskal/Prim, and spanning-forest invariants. |
| [MIT 6.046J Lecture 13: Incremental Improvement — Max Flow, Min Cut](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-13-incremental-improvement-max-flow-min-cut/) | Session 6 source for capacity/conservation definitions, residual augmenting paths, flow residual/cut reasoning, the max-flow/min-cut proof idea, and matching transfer. Link and paraphrase only; accessed 2026-08-04. |
| [MIT 6.042J Mathematics for Computer Science](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) | Graph definitions, relations, induction, and proof techniques already introduced in Module 4. |
| [Python 3.14 `collections.deque`](https://docs.python.org/3.14/library/collections.html#collections.deque) | Appropriate FIFO frontier mechanism for BFS. |
| [Python 3.14 `heapq`](https://docs.python.org/3.14/library/heapq.html) | Priority frontier mechanism for Dijkstra-style algorithms. |

**Synthesis decisions**

- Treat an algorithm as a state machine made of graph representation, frontier, visited/finalized state, and evidence maps.
- Derive BFS and DFS by changing frontier discipline.
- Prove traversal properties from explicit frontier invariants.
- Make weight assumptions visible before choosing a shortest-path algorithm.
- Make capacity, conservation, residual reversibility, and cut certificates visible before claiming throughput.
- Use Atlas's prerequisite relation, already modeled in Module 4, so the mathematical graph becomes executable without changing its meaning.

**Claims we will not make**

- “Visited” has no universal placement rule independent of the algorithm's invariant.
- Dijkstra is not valid for arbitrary negative edge weights.
- BFS does not find minimum-weight paths merely because it finds minimum-edge paths.
- A topological order does not exist for a graph with a directed cycle.
- A locally feasible flow is not automatically maximum; the residual stop rule or a cut certificate must be visible.

### Module 11 — Algorithm-design paradigms

| Source | Role in our module |
|---|---|
| [MIT 6.006 Lectures 15–18 in the lecture-video index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-videos/) | Four-part dynamic-programming sequence: recursive structure, subproblems, parent reconstruction, and pseudopolynomial behavior. |
| [MIT 6.006 Lecture 16: LCS, LIS, and Coins](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-16-dynamic-programming-part-2-lcs-lis-coins/) | Concrete practice defining subproblem state and dependencies. |
| [UC Berkeley CS 170 Spring 2026](https://cs170.org/) | Broader advanced-algorithms sequence covering divide-and-conquer, greedy algorithms, dynamic programming, randomized algorithms, approximation, and complexity. |
| [CS 170 course policies and scope](https://cs170.org/policies/) | Confirms current course coverage and provides a problem-solving/academic-integrity context for adaptation. |
| [`functools.cache` and `lru_cache`](https://docs.python.org/3.14/library/functools.html#functools.cache) | Official Python mechanism for memoization experiments, after the recurrence and state definition are understood. |
| [`random` security warning](https://docs.python.org/3.14/library/random.html) | Clarifies that simulation-oriented pseudorandomness and security-sensitive randomness are different concerns. |

**Synthesis decisions**

- Organize paradigms by the structural claim that makes them valid, not by code template.
- Derive dynamic programming as evaluation of a subproblem dependency DAG.
- Require a precise sentence defining every subproblem before code or table layout.
- Contrast a greedy exchange argument with DP's exhaustive coverage of relevant choices.
- Use backtracking to expose pruning invariants, and randomized methods to revisit expected analysis.
- Introduce approximation as a guarantee/constraint tradeoff, not as “giving up.”

**Claims we will not make**

- Memoization is not equivalent to “make recursion fast” without a bounded repeated subproblem space.
- Greedy choice is not justified by good benchmarks.
- Overlapping subproblems alone do not define a useful DP; state and transitions still require proof.
- A pseudopolynomial algorithm is not polynomial in the encoded input length merely because its loop bound looks numeric.
- Random testing is not a proof of a randomized algorithm's expected guarantee.

## Source-to-session routing

Michael should not read every source above. For each module, the default learner packet is:

1. one short course explanation in the visual portal;
2. one selected university segment;
3. one official Python reference excerpt used as a lookup exercise;
4. one guided code-reading target;
5. one Atlas studio and one confidence-aware check.

The remaining sources are instructor references for triangulation and remediation.

| Learning need | Primary learner source | When it appears |
|---|---|---|
| Interface versus representation | MIT 6.006 Lecture 2 | Module 6 opening |
| Iterator state and generator tracing | CS 61A Summer 2026 Discussion 5 + Python expression reference | Module 7 middle |
| Hash reasoning | MIT 6.006 Lecture 4 + Python data model | Module 8 core |
| Ordered structure tradeoffs | MIT 6.006 Lectures 6–8 + `heapq` | Module 9 core |
| Graph traversal and flow invariants | MIT 6.006 Lectures 9–13; MIT 6.046J Lecture 13 | Module 10 core |
| Defining DP subproblems | MIT 6.006 Lectures 15–18 | Module 11 core |

## Bounded GitHub reading ladder

Repository reading is question-led. The learner receives a pinned branch/tag, a small file set, and a call-path or invariant question.

1. **Module 6:** CPython `Objects/listobject.c` — locate resize decisions and distinguish logical length from allocated capacity.
2. **Module 7:** CPython standard-library `Lib/collections/__init__.py` only if a Python-level wrapper answers a specific protocol question; language behavior remains grounded in docs.
3. **Module 8:** CPython `Objects/dictobject.c` — locate comments describing table states and identify which facts are implementation-specific.
4. **Module 9:** CPython `Lib/heapq.py` — trace `heappush` or `heappop` through its helper and state the heap invariant in the learner's own words.
5. **Module 10:** a small, instructor-curated Atlas graph module rather than an industrial graph library, so the frontier and evidence maps remain visible.
6. **Module 11:** an agent-generated planner plus tests, reviewed against a written recurrence and state meaning.

The reading target is understanding, architecture recovery, and claim verification—not repository tourism.

## Coverage and gap audit

| Competency | Covered in | Evidence |
|---|---|---|
| ADT/implementation distinction | 3, 6–9 | operation matrix + representation swap |
| Linear and linked representations | 6 | trace + history-buffer comparison |
| Stack, queue, iterator, lazy stream | 7 | protocol trace + bounded-pipeline failure analysis |
| Hash table and collision reasoning | 8 | invariant argument + adversarial tests |
| Trees, heaps, tries, sorting | 9 | scheduler/prefix-search architecture defense |
| Graph representations and traversal | 10 | trace + correctness argument |
| Shortest paths and topological ordering | 10 | algorithm selection under changed assumptions |
| Divide-and-conquer, greedy, DP, backtracking, randomized/approximation intuition | 11 | strategy comparison + constrained planner |
| Worst/expected/amortized analysis | 5, 6, 8, 9 | explicit case labels and evidence |
| Python language/CPython boundary | 6–9 | claim badges and source verification |
| Code reading, debugging, design, delegation, review | all Arc II modules | evidence ledger + oral checkoffs |

### Deliberate deferrals

- formal concurrency and asynchronous iteration → Modules 19 and 21;
- database B-trees and persistent indexes → Module 16;
- cache architecture and quantitative memory hierarchy → Module 17;
- CPython object layout, reference counting, and garbage collection internals → Module 24;
- advanced complexity and NP-completeness → introduced at the edge of Module 11, developed when needed in later studios.

Deferral is not omission. Each deferred topic gets a visible forward connection so the current model remains honest about its boundary.

## Instructor freshness checklist

Before teaching a cohort:

- verify the pinned Python minor version and official documentation URLs;
- pin CPython reading links to the matching release branch or tag;
- check current university pages and archive stable materials where licensing permits;
- confirm every cost claim states its workload, case, and assumptions;
- ensure no CPython implementation fact is presented as a Python guarantee;
- replace any external exercise whose solution has become the point of the task;
- keep assigned reading small enough that the Atlas investigation remains the center of learning.
