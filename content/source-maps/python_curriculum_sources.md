# Source map for the integrated Python and computer science curriculum

**Research cutoff:** 2026-08-01  
**Purpose:** identify authoritative, usable sources for a coached curriculum that begins with intermediate Python, develops advanced Python and software engineering, and then connects those skills to the core of an undergraduate computer science education.

## Executive recommendation

No single public course covers the requested journey well. The strongest design is a layered curriculum:

1. Use [CS2023](https://csed.acm.org/) as the **coverage and competency checklist**, not as the syllabus.
2. Use [MIT 6.101](https://py.mit.edu/spring26/) as the primary **teaching rhythm and substantial-lab model**.
3. Use selected work from [Berkeley CS61A](https://cs61a.org/), [Composing Programs](https://www.composingprograms.com/), and the advanced half of the [University of Helsinki Python MOOC](https://programming-26.mooc.fi/) as the **Python-to-CS bridge**.
4. Use official Python, PyPA, pytest, and typing documentation as the **current production-practice layer**.
5. Build the deeper CS sequence around discrete mathematics → algorithms → software construction → systems → operating systems/databases/networks/security/programming languages → capstone.

This makes Python the main implementation language without pretending that Python alone can teach memory safety, machine representation, assembly, kernel interfaces, or language comparison. A bounded C/RISC-V segment and at least one contrasting language are educational requirements, not curriculum drift.

## How the sources fit together

```text
Intermediate Python bridge
        │
        ├── Advanced Python language model ──► packaging, testing, typing, concurrency
        │
        ├── Discrete mathematics ────────────► algorithms and data structures
        │                                             │
        │                                             ├── databases
        │                                             └── security foundations
        │
        ├── Interpreter project ─────────────► programming languages
        │
        └── Computer architecture/C ─────────► operating systems
                                                      │
                                                      ├── networking
                                                      ├── database internals
                                                      └── systems security

All strands ─────────────────────────────────► team capstone
```

The connections matter more than the catalog:

- Proof techniques from discrete mathematics support algorithm correctness, protocol reasoning, and security arguments.
- A Python interpreter project makes scope, environments, parsing, evaluation, and language semantics concrete before a programming-languages course.
- Packaging, testing, static analysis, code review, and Git should begin early and recur in every project; they should not be isolated in a one-week “tools” unit.
- Architecture and C must precede serious operating-systems and memory-safety work.
- Networking is much easier after processes, file descriptors, concurrency, and operating-system boundaries are understood.
- The capstone should integrate at least two advanced areas and include design, testing, documentation, demonstrations, and retrospectives.

## Curriculum guidance

### ACM/IEEE-CS/AAAI CS2023

The official [Computer Science Curricula 2023](https://csed.acm.org/) report defines 17 knowledge areas and frames curriculum in terms of competencies rather than only topic exposure. The [knowledge-area index](https://csed.acm.org/knowledge-areas/) includes algorithmic foundations, architecture, data management, mathematical foundations, networking, operating systems, parallel and distributed computing, programming languages, security, software development, software engineering, systems fundamentals, AI, HCI, graphics, specialized platforms, and society/ethics/professionalism. The complete [CS2023 report](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm) is the authoritative reference.

**Best use:** audit the finished curriculum for missing foundations, advanced-area breadth, and professional/ethical competencies.

**Do not use it as:** a week-by-week teaching order. Its intentionally compact core and institutional scope require adaptation for a one-learner coached program.

### ABET computing criteria

The [ABET 2026–2027 Criteria for Accrediting Computing Programs](https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2026-2027/) provide a complementary outcomes check: an accredited computer-science program is expected to cover algorithms and complexity, theory, programming languages, software development, architecture, information management, networking, operating systems, parallel/distributed computing, discrete mathematics, probability/statistics, and a major integrative project.

**Best use:** test whether the final learning path has both breadth and a genuine culminating experience. ABET and CS2023 are design constraints, not learner-facing teaching materials.

## Python and computational thinking spine

### MIT 6.101: Fundamentals of Programming

[MIT 6.101 Spring 2026](https://py.mit.edu/spring26/) is the best model for the learning loop. Its [calendar](https://py.mit.edu/spring26/calendar), [readings](https://py.mit.edu/spring26/readings), and [labs](https://py.mit.edu/spring26/labs) combine short conceptual preparation with substantial weekly programming work, midpoint and wrap-up recitations, open lab support, and brief code checkoffs. Public labs include image processing, graph search, Snekoban, autocomplete, a SAT solver, a spreadsheet, symbolic algebra, a Lisp interpreter, and a game.

The [Symbolic Algebra lab](https://py.mit.edu/spring26/labs/symbolic_algebra) is especially useful: it combines object-oriented modeling, operator overloading, parsing, automated tests, and code-quality tools in one coherent problem.

**Best use:** adopt its cycle—pre-reading → small readiness questions → 6–10 hour lab → TA check-in → code review/reflection—and adapt selected lab ideas rather than copying an entire institutional course.

**Limitations:** it remains a fundamentals course, and some lab restrictions are deliberate teaching constraints rather than production recommendations. Those constraints should be labeled explicitly.

### Berkeley CS61A and Composing Programs

[Berkeley CS61A](https://cs61a.org/) develops a rigorous mental model of evaluation, environments, higher-order functions, recursion, mutation, data abstraction, iterators/generators, objects, efficiency, and interpreter construction. Its [resources archive](https://cs61a.org/resources/) provides lectures, discussions, labs, homework, projects, quizzes, and exams. The open textbook [Composing Programs](https://www.composingprograms.com/) covers the same intellectual progression in a coherent narrative.

**Best use:** selected modules on environments and closures, recursive decomposition, abstraction, iterators, object systems, and interpreters. These topics create the conceptual bridge from “writing scripts” to understanding computation.

**Limitations:** CS61A is a computer-science course, not a comprehensive modern Python engineering course. It deliberately shifts to Scheme and SQL, while its text does not cover current packaging, typing, deployment, or production observability.

### University of Helsinki Python MOOC

The [2026 Python Programming MOOC](https://programming-26.mooc.fi/) offers a large, graded exercise bank. Parts 8–14 cover classes, references, encapsulation, class attributes, object hierarchies, larger applications, comprehensions, recursion, higher-order functions, generators, regular expressions, events, and a game capstone. The [course source repository](https://github.com/rage/programming-26) is openly available under a Creative Commons noncommercial license.

**Best use:** a diagnostic and bridge for learners whose “intermediate” skills are uneven; use its automated exercises selectively before harder design-oriented labs.

**Limitations:** its endpoint is closer to solid intermediate Python than advanced professional Python. It should not become the whole curriculum.

### Harvard CS50P

[CS50’s Introduction to Programming with Python](https://cs50.harvard.edu/python/) provides polished lectures, short explanations, problem sets, and a consistent beginner-friendly interface. Its later weeks on exceptions, libraries, unit tests, files, regular expressions, and OOP are useful as remediation. Its [final-project specification](https://cs50.harvard.edu/python/project/) provides an accessible first independent-project template with tests, documentation, requirements, and a demonstration.

**Best use:** concise refreshers and an early, low-stakes independent project.

**Limitations:** the project structure is intentionally simple and does not teach mature package layout, CI, architecture, release engineering, or long-lived maintenance.

### Stanford CS41 and Advanced Python Mastery

[Stanford CS41](https://stanfordpython.com/) assumes prior programming and explores Pythonic data modeling, decorators, custom objects, and functional and object-oriented styles; the official [Stanford course listing](https://bulletin.stanford.edu/courses/2179021) confirms its advanced-Python orientation. Public course material is maintained in [Stanford’s CS41 documentation repository](https://code.stanford.edu/cs41/documentation).

David Beazley’s [Advanced Python Mastery](https://github.com/dabeaz-course/python-mastery) is an unusually strong exercise-driven treatment of Python’s core execution and object models. It includes slides, exercises, and solutions and is suitable for guided advanced practice.

**Best use:** select difficult exercises on object behavior, descriptors, decorators, iteration, generators, and program organization after the learner has a strong intermediate baseline.

**Limitations:** CS41’s public presentation and topic mix vary by offering. Advanced Python Mastery largely reflects the Python 3.6 era and intentionally omits modern typing, structural pattern matching, and async programming; every language claim should be checked against the current Python reference.

### M1–M5 learner calibration route

These compact cards make the gateway's university calibration inspectable at
the exact Atlas artifact, rather than turning the module into a reading pile.
All sources below were checked **2026-08-01** and are link-only; Atlas retains
original explanations, diagrams, code, prompts, diagnostics, and projects.

| Module and Atlas artifact | Official calibration anchor | Outcome decision |
| --- | --- | --- |
| M1 object/binding trace and shared-state regression | [MIT 6.100L calendar](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/calendar/) | **Aligned, adapted:** execution, mutation, aliasing, debugging, and assertions; lower-level systems and institutional practice volume are deferred. |
| M2 recursive contract, trace, proof, and cost ledger | [MIT 6.042J syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) | **Aligned, adapted:** recursion, well-founded progress, induction, correctness, and termination; larger problem-set volume is optional depth. |
| M3 EventStore contract and AF/RI evidence | [MIT 6.102 AF/RI notes](https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/) | **Aligned, adapted:** representation independence and implementation obligations are translated to Python mechanisms. |
| M4 quantified-claim, relation/graph, and counterexample table | [MIT 6.042J readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/) | **Aligned, compressed:** proof and graph foundations are present; the full discrete-math term continues through M27. |
| M5 cost-model and measurement-reconciliation dossier | [MIT 6.006 syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) | **Aligned, adapted:** modeling and analysis are present; the breadth of algorithms/data structures unfolds from M6 onward. |

This records comparable conceptual rigor and evidence expectations—not
enrollment, grading, faculty feedback, credit, or institutional equivalence.

## Current Python engineering sources

Official documentation should supply canonical semantics and current APIs, while university material supplies sequencing and assignments.

| Area | Primary sources | Best instructional use | Important caution |
|---|---|---|---|
| Object/data model | [Python 3.14 data model](https://docs.python.org/3.14/reference/datamodel.html), [classes tutorial](https://docs.python.org/3.14/tutorial/classes.html), [descriptor guide](https://docs.python.org/3.14/howto/descriptor.html), [dataclasses](https://docs.python.org/3.14/library/dataclasses.html) | Experiments with identity, equality, hashing, attribute lookup, descriptors, protocols, special methods, and value objects | Documentation is a reference, not an exercise sequence |
| Imports and APIs | [Import system](https://docs.python.org/3.14/reference/import.html), [contextlib](https://docs.python.org/3.14/library/contextlib.html), [PEP 8](https://peps.python.org/pep-0008/) | Package boundaries, resource management, public APIs, and style decisions | Distinguish language rules from style recommendations |
| Packaging | [PyPA packaging overview](https://packaging.python.org/en/latest/overview/), [packaging-project tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/), [`pyproject.toml` guide](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/), [`pyproject.toml` specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/) | Build a distributable package, explain build frontends/backends, wheel vs. sdist, metadata, `src` layout, and TestPyPI | Guidance evolves; distinguish normative specifications from recommendations |
| Testing | [pytest getting started](https://docs.pytest.org/en/stable/getting-started.html), [fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html), [parametrization](https://docs.pytest.org/en/stable/how-to/parametrize.html), [good practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html) | Test design, isolation, fixtures, parametrized cases, regression tests, and project layout | Teach plain tests first; premature autouse fixtures and complex fixture graphs hide dependencies |
| Type systems | [Python typing docs](https://docs.python.org/3.14/library/typing.html), [typing specification](https://typing.python.org/en/latest/spec/), [mypy getting started](https://mypy.readthedocs.io/en/stable/getting_started.html), [mypy protocols](https://mypy.readthedocs.io/en/stable/protocols.html) | Gradual typing, generics, protocols, variance, `TypedDict`, overloads, and boundary-oriented type design | Annotations are not runtime enforcement; checkers legitimately differ |
| Concurrency | [asyncio overview](https://docs.python.org/3.14/library/asyncio.html), [tasks and task groups](https://docs.python.org/3.14/library/asyncio-task.html), [asyncio development guide](https://docs.python.org/3.14/library/asyncio-dev.html), [concurrent futures](https://docs.python.org/3.14/library/concurrent.futures.html), [multiprocessing](https://docs.python.org/3.14/library/multiprocessing.html) | Compare cooperative concurrency, threads, processes, cancellation, timeouts, structured concurrency, and failure propagation | Pin the Python version; cancellation and task APIs evolve |
| Performance | [profiling](https://docs.python.org/3.14/library/profile.html), [`tracemalloc`](https://docs.python.org/3.14/library/tracemalloc.html) | Measurement-first optimization, CPU profiles, allocation traces, and evidence-based refactoring | Do not teach folklore benchmarks as universal truths |
| Property testing | [Hypothesis tutorial](https://hypothesis.readthedocs.io/en/latest/tutorial/adapting-strategies.html), [Hypothesis repository](https://github.com/HypothesisWorks/hypothesis) | Turn invariants into generated tests after ordinary unit testing is comfortable | Keep strategies readable and tied to explicit properties |

For course reproducibility, pin one Python minor version—currently 3.14—and record tool versions in each project. Later cohorts can update deliberately.

## First-principles computer science sequence

### 1. Discrete mathematics

[MIT 6.042J Mathematics for Computer Science](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) supplies a complete open text, videos, problem sets, and exams covering definitions and proofs, induction, sets, functions, relations, graphs, state machines, number theory, counting, and discrete probability.

**Connection:** introduce proof writing before algorithm analysis. Python can support computational experiments, counterexample searches, graph exploration, and probability simulation, but executable evidence must not replace a proof.

### 2. Algorithms and data structures

[MIT 6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) combines mathematical modeling, data structures, algorithmic paradigms, correctness, and asymptotic performance. Its materials include Python-based examples, lectures, notes, practice, problem sets, quizzes, and solutions.

**Connection:** this is the natural next step after 6.042 topics on proofs, recurrences, graphs, and probability. Every implementation assignment should require an invariant or correctness explanation plus empirical measurement.

### 3. Software construction

[MIT 6.102 Software Construction Spring 2026](https://web.mit.edu/6.102/www/sp26/) is the current version of MIT's software-construction sequence. It covers specifications, testing, code review, version control, static checking, mutability, abstract data types, representation invariants, interfaces, debugging, concurrency, and collaborative development. The older [MIT 6.005 OCW archive](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/) is the more stable, fully open source for readings, exercises, and assignments. [MIT 6.031 Fall 2021](https://web.mit.edu/6.031/www/fa21/) additionally exposes a useful team-work, check-in, reflection, and quiz structure.

**Connection:** port the concepts—not the TypeScript/Java syntax—to typed Python, pytest, PyPA packaging, and Git. Begin this strand while algorithms are underway so every later project inherits quality practices.

### 4. Architecture and computer systems

[Berkeley CS61C](https://cs61c.org/sp26/) and its [course notes](https://notes.cs61c.org/) cover number representation, C and pointers, RISC-V, CPU design, caches, virtual memory, and parallelism. The official [Berkeley catalog description](https://www2.eecs.berkeley.edu/Courses/CS61C/) documents the course’s architecture and machine-structure scope.

[CMU 15-213 Introduction to Computer Systems](https://csd.cs.cmu.edu/course/15213/s26) offers a programmer’s view of machine code, data representation, optimization, memory, linking, processes, networking, and concurrency; the [Spring 2025 site](https://www.cs.cmu.edu/afs/cs/academic/class/15213-s25/www/) shows the teaching structure.

**Connection:** choose one primary route. Berkeley is strongest for architecture and RISC-V labs; CMU is strongest for the programmer’s systems perspective. Python simulations can introduce caches, scheduling, and binary formats, but a bounded C/assembly component is indispensable.

For learners who benefit from an integrated build-up, [Nand2Tetris](https://www.nand2tetris.org/) provides official tools, lectures, and projects that construct a computer from logic gates through an assembler, virtual machine, compiler, and toy operating system. It is an excellent optional project spine but requires substantial extra time.

### 5. Operating systems

[MIT 6.1810 Operating System Engineering](https://pdos.csail.mit.edu/6.1810/2025/overview.html) teaches virtual memory, file systems, threads, context switches, kernels, interrupts, system calls, IPC, synchronization, and hardware interaction through xv6 on RISC-V.

**Connection:** place it after architecture, C, and concurrency. Use Python for schedulers, filesystem prototypes, or coordination simulations, but retain C/xv6 for the core labs because kernel boundaries and raw memory are the subject.

### 6. Databases

[Berkeley CS186 Spring 2026](https://cs186berkeley.net/) provides a current public undergraduate sequence covering SQL, storage, buffers, B+ trees, query execution and optimization, transactions, recovery, distributed databases, and NoSQL. The [CMU Database Group course index](https://db.cs.cmu.edu/courses/) identifies CMU's current undergraduate database-systems course, 15-445/645; its [Fall 2025 offering](https://15445.courses.cs.cmu.edu/fall2025/) exemplifies a project-oriented treatment of the relational model, storage, indexes, query execution and optimization, transactions, concurrency, and recovery.

**Connection:** use Berkeley as the primary undergraduate sequence; use CMU as an advanced internals supplement. Start with SQL and a Python application, then implement smaller Python versions of a page store, B+ tree, query operator, and transaction scheduler. The full CMU BusTub project is valuable but C++-heavy and unrealistic unless the learner has that prerequisite.

### 7. Networking

[Stanford CS144](https://web.stanford.edu/class/cs144/) teaches networking by building a byte stream, TCP receiver and sender, router, and network interface.

**Connection:** precede it with operating-system concepts and concurrency. Python socket clients, packet inspection, and small application protocols make excellent early labs, but implementing transport machinery in a lower-level language exposes the buffer and performance constraints that Python hides.

### 8. Programming languages

[Brown CSCI 1730](https://cs.brown.edu/courses/csci1730/2025/) studies programming-language design and implementation; its official open text, [Programming Languages: Application and Interpretation](https://cs.brown.edu/~sk/Publications/Books/ProgLangs/PDF/all.pdf), develops interpreters and semantic models.

**Connection:** use CS61A/MIT’s Python interpreter work first, then deliberately introduce Racket or another contrasting language. Scope, closures, evaluation, typing, and language design are learned through comparison; forcing this entire subject into Python would weaken it.

### 9. Security

[Berkeley CS161](https://www2.eecs.berkeley.edu/Courses/CS161/) covers memory safety, cryptography, web and network security, access control, operating-system security, and defensive programming. The [Spring 2026 course site](https://sp26.cs161.org/) and [open textbook](https://textbook.cs161.org/) provide a current lecture, worksheet, and project framework.

**Connection:** schedule security after discrete math, algorithms, architecture/C, systems, and networking basics. Python is well suited to web-security labs, protocol tooling, and demonstrations of cryptographic misuse, but learners should use audited cryptographic libraries and never invent production cryptography.

### 10. Team capstone

Three sources provide complementary capstone guidance:

- [University of Washington capstone criteria](https://www.cs.washington.edu/academics/undergraduate/degree-requirements/capstones/) require a substantial team project, major design effort, multiple advanced subareas, and oral and written communication.
- [Purdue CS407](https://www.cs.purdue.edu/academic-programs/courses/canonical/cs407.html) provides an adoptable delivery cadence: teams, charter, product backlog, design work, three sprints, planning, demonstrations, retrospectives, and a formal final presentation.
- [Stanford CS194](https://web.stanford.edu/class/cs194/) emphasizes a significant team implementation, continuing design/specification/testing, weekly progress, architecture diagrams, justified KPIs, and a public demo; its [official listing](https://bulletin.stanford.edu/courses/1057051) confirms the course role.
- [Berkeley CS169L](https://www2.eecs.berkeley.edu/Courses/CS169L/) is a useful process model for an open-ended product built for a real stakeholder, including agile roles, code review, CI/CD, open-source contribution, legacy-code work, and technical communication.

**Recommended synthesis:** use UW and ABET to judge project scope, Purdue to run the cadence, Stanford to define visible technical artifacts, and Berkeley to model modern delivery practice. A one-person version can simulate team roles through design reviews and change requests, but should still produce a charter, architecture decision records, backlog, threat model, test plan, CI, operational metrics, demos, retrospectives, and a final technical report.

## GitHub code-reading ladder

Code reading should progress by conceptual purpose, not repository fame:

1. [PyPA Sample Project](https://github.com/pypa/sampleproject) — inspect package metadata, layouts, build configuration, and distribution artifacts.
2. [pytest](https://github.com/pytest-dev/pytest) — trace test discovery, fixtures, plugin boundaries, compatibility strategy, and the project’s own tests.
3. [typeshed](https://github.com/python/typeshed) and [mypy](https://github.com/python/mypy) — study typed public interfaces, structural typing, type-checker architecture, and large-scale test corpora.
4. [CPython](https://github.com/python/cpython) with the [Developer Guide](https://devguide.python.org/) and [internals guide](https://devguide.python.org/internals/) — guided reading of selected standard-library modules, tests, grammar, bytecode, or runtime internals.

For CPython, pin a release tag and clearly distinguish language guarantees from implementation details. Do not assign an unguided “read this repository” task; give a call path, a question, a small file set, and a written observation template.

## Teaching and TA model supported by the sources

A workable weekly unit synthesizes the strongest public-course patterns:

1. **Concept session:** a short reading/video plus instructor explanation and prediction questions.
2. **Guided practice:** small executable experiments and one proof/design exercise.
3. **Lab or project:** an authentic problem with staged milestones and a test harness.
4. **TA session:** learner explains current design, demonstrates one failing case, and chooses the next smallest step; the TA gives hints before solutions.
5. **Code checkoff:** a short oral defense of trade-offs, invariants, tests, and limitations.
6. **Quiz:** retrieval questions, code tracing, debugging, and one transfer problem.
7. **Reflection:** what changed, what evidence supports correctness/performance, and what would be redesigned.

This follows MIT 6.101’s readings/labs/checkoffs, Berkeley’s discussion-and-project ecosystem, and MIT 6.031’s review/reflection/team practices. Projects should be reused across modules where possible: for example, an autocomplete engine can begin as an algorithms lab, become a packaged typed library, gain profiling and property tests, expose a network service, persist to a database, and receive a security review.

## Source-selection cautions

- **Version currency:** university concepts age slowly, but Python APIs, packaging guidance, test tools, and type checking change quickly. Recheck official documentation at the start of each cohort.
- **Open access is not unrestricted reuse:** link to university assignments and adapt ideas; respect each site’s license and academic-integrity policy. Helsinki’s repository, for example, has an explicit noncommercial Creative Commons license.
- **Python-primary is not Python-exclusive:** C/assembly for systems and a contrasting language for programming-languages study are part of the learning objective.
- **Projects need scaffolding:** published university assignments assume institutional infrastructure, staff, peers, prerequisites, and office hours. Reduce surface area while preserving the core intellectual task.
- **Avoid source overload:** assign one primary explanation, one reference, and one exercise set per topic. The rest of this memo is instructor material.
- **Ethics and security are cross-cutting:** apply privacy, threat modeling, accessibility, attribution, and professional responsibility throughout rather than placing them only in a terminal module.

## Priority shortlist

If the curriculum must start with a small set of sources, use:

1. [CS2023](https://csed.acm.org/) for coverage.
2. [MIT 6.101](https://py.mit.edu/spring26/) for pedagogy and lab design.
3. [Composing Programs](https://www.composingprograms.com/) plus selected [CS61A](https://cs61a.org/) material for computational abstraction.
4. [Python 3.14 documentation](https://docs.python.org/3.14/) plus [PyPA](https://packaging.python.org/), [pytest](https://docs.pytest.org/en/stable/), and the [typing specification](https://typing.python.org/en/latest/spec/) for modern engineering.
5. [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) and [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) for mathematical and algorithmic foundations.
6. [MIT 6.031](https://web.mit.edu/6.031/www/fa21/) for software construction.
7. One systems route—[Berkeley CS61C](https://cs61c.org/sp26/) or [CMU 15-213](https://csd.cs.cmu.edu/course/15213/s26)—followed by selected OS, networking, database, security, and PL sources above.
8. UW/Purdue/Stanford capstone guidance for the culminating project.
