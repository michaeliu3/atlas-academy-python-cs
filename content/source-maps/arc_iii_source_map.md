# Arc III Source Map — Software as a Durable System

**Audit date:** 2026-07-29  
**Modules covered:** 12–16  
**Version baseline for claims:** Python 3.14.6 (released 2026-06-10) and CPython tag `v3.14.6`, peeled commit `c63aec69bd59c55314c06c23f4c22c03de76fe45`; PostgreSQL 18; SQLite 3.53.4 (released 2026-07-24), source ID `bf7c7f30031888f4e796e429ab3978879485813aaca6f641c7b33e4e09459bcc`. The learner runtime and lab configuration must still be recorded and re-pinned before a teaching run.

## Why this map exists

Arc III changes the unit of reasoning. Earlier modules can ask whether a function or algorithm is correct for one input. A durable software system must remain understandable and correct while:

- code is split across modules and owned by different people;
- implementations change behind public contracts;
- failures occur outside the happy path;
- data outlives a process and crosses trust boundaries;
- multiple operations or users compete over shared state.

This is therefore not a bibliography and should not be taught as five unrelated tool surveys. The connected first-principles chain is:

> hidden representation creates a contract → a contract creates testable claims → testable claims make controlled change possible → controlled change must survive delivery and persistence boundaries → shared durable state requires a relational and transactional model.

The source policy is deliberately conservative:

1. **University material supplies the conceptual spine.** MIT 6.102/6.005 anchors software construction; CMU 15-445 and Berkeley CS 186 anchor database theory and implementation.
2. **Specifications define language and file-format contracts.** Python, typing, PyPA, SQL-engine, and OpenTelemetry specifications outrank tutorials for normative claims.
3. **Official implementation documentation exposes operational reality.** PostgreSQL and SQLite are compared because “SQL” and “ACID” alone do not determine engine behavior.
4. **Repository reading is bounded.** The learner follows one call path or artifact, records a model, and stops. Reading an entire framework is neither necessary nor pedagogically useful here.
5. **Sources are transformed into original instruction.** Lessons should use original explanations, diagrams, Atlas examples, counterexamples, and quizzes; links remain available for verification and deeper study.

## Arc-level anchors and source roles

| Source | Exact link | Role in the arc | Guardrail |
|---|---|---|---|
| MIT 6.102 Software Construction, Spring 2026 | [course home](https://web.mit.edu/6.102/www/sp26/) and [learning objectives](https://web.mit.edu/6.102/www/sp26/general/) | Current undergraduate spine for software that is safe from bugs, easy to understand, and ready for change | Examples are primarily TypeScript, so the course must translate concepts into Python without pretending syntax is the concept |
| MIT 6.005 Software Construction, Spring 2016 | [OCW course](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/) and [reading index](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/pages/readings/) | Stable archival fallback and broader syllabus coverage for specifications, ADTs, design, review, and version control | Java examples are comparative material, not Python prescriptions |
| Python 3.14.6 and CPython source | [3.14.6 release](https://www.python.org/downloads/release/python-3146/), [3.14 documentation](https://docs.python.org/3.14/), and [`v3.14.6` source](https://github.com/python/cpython/tree/c63aec69bd59c55314c06c23f4c22c03de76fe45) | Runtime, standard-library, import, I/O, debugging, serialization, and `sqlite3` behavior | The documentation URL follows the 3.14 maintenance series; source-reading links below pin the exact 3.14.6 commit, and labs record the actual interpreter |
| Python typing specification | [canonical specification](https://typing.python.org/en/latest/spec/) | Normative source for generics, protocols, and static type-system concepts | Individual type checkers may support or interpret edge cases differently |
| Python Packaging Authority | [Python Packaging User Guide](https://packaging.python.org/en/latest/) | Packaging interoperability specifications and maintained workflows | Specifications, frontends, backends, installers, and lock tools are distinct layers |
| CMU 15-445/645, Fall 2025 | [syllabus](https://15445.courses.cs.cmu.edu/fall2025/syllabus.html) and [schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) | Database-system architecture from relational model through indexes, concurrency, and recovery | Do not turn the course’s implementation projects into unbounded prerequisites |
| Berkeley CS 186 notes | [course notes index](https://cs186berkeley.net/notes/) | A second university explanation for normalization, optimization, transactions, and recovery | Semester notes are teaching sources, not cross-engine product contracts |
| PostgreSQL 18 documentation | [PostgreSQL 18 manual](https://www.postgresql.org/docs/18/) | Concrete client/server DBMS behavior and plan-reading evidence | Replace `/current/` links with the exact taught major in released lessons |
| SQLite 3.53.4 documentation | [3.53.4 release record](https://www.sqlite.org/releaselog/3_53_4.html) and [documentation index](https://www.sqlite.org/docs.html) | Concrete embedded-engine behavior, atomic commit, journaling, and query plans | The living topic pages can drift; record SQLite 3.53.4/source ID, compile options, and relevant PRAGMAs in labs, then re-audit if the lab engine differs |

### Dependency graph

| Module | Question it resolves | Knowledge it consumes | Contract it hands forward |
|---|---|---|---|
| 12. Modules, APIs, types, and dependency direction | How can parts vary without every caller knowing their representation? | Functions, ADTs, algorithm selection, Python object model | Named boundaries, dependency graph, typed plugin contract |
| 13. Specifications, testing, debugging, observability | How can we state and investigate what a boundary is supposed to do? | M12 APIs and type relations | Executable claims, failure evidence, regression protection |
| 14. Software design and change | How can a system change while preserving chosen behavior? | M12 contracts and M13 evidence | Reviewable architecture and reversible change history |
| 15. Files, serialization, packaging, delivery | How does the system cross process, machine, and installation boundaries safely? | M12 API surface, M13 tests, M14 release-sized changes | Versioned persistent formats and installable Atlas CLI |
| 16. Relational data and transactions | How can durable shared state preserve relationships under concurrency and failure? | M15 persistence boundaries plus all prior contracts | Transactional repository contract for later service/concurrency arcs |

---

## Module 12 — Modules, APIs, types, and dependency direction

### Dependency role

Module 11 produced alternative algorithms and policies. Module 12 makes those alternatives substitutable components rather than conditionals scattered through the program. It introduces three different—but connected—boundaries:

- the **runtime boundary**, where imports locate, execute, cache, and bind modules;
- the **semantic boundary**, where a public API hides representation and defines allowed observations;
- the **static boundary**, where annotations express relationships a checker can inspect before execution.

This module is prerequisite to M13 because a test needs a claim and a boundary. It is prerequisite to M14 because refactoring requires an observable contract to preserve. It also establishes the plugin and adapter seams used by packaging in M15 and storage in M16.

### First-principles pressure

Begin with a concrete Atlas failure, not terminology:

1. Atlas directly imports three file parsers and contains an `if/elif` for every parser.
2. Adding one importer forces edits in selection, parsing, ranking, tests, and CLI code.
3. A circular import appears when a parser imports the central registry.
4. One parser returns `list[dict[str, object]]`; another returns domain records; callers learn both representations.
5. A type annotation says `Importer`, but nothing at runtime prevents a broken plugin from loading.

The pressure is **change amplification**: one decision has too many reasons to change and too many dependents. From there derive information hiding, minimal public APIs, dependency direction, generics, and structural typing. A `Protocol` is introduced only after the learner can state which caller-visible behavior must remain stable.

### Recommended reading sequence and source contribution

| Order | Source | What it contributes to the teaching synthesis |
|---:|---|---|
| 1 | MIT 6.102, [Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) | Abstraction, modularity, encapsulation, information hiding, separation of concerns, and representation independence. This is the “why” before Python mechanisms. |
| 2 | Python tutorial, [Modules](https://docs.python.org/3.14/tutorial/modules.html) | Learner-level model of module namespaces, import forms, packages, `__name__`, and search paths. |
| 3 | Python language reference, [The import system](https://docs.python.org/3.14/reference/import.html) | Normative separation of module search/loading from name binding; `sys.modules`, finders, loaders, package semantics, and partially initialized modules. |
| 4 | Python library reference, [`importlib`](https://docs.python.org/3.14/library/importlib.html) | Programmatic import mechanisms and the relationship between high-level helpers and the import machinery. |
| 5 | MIT 6.102, [Interfaces and subtyping](https://web.mit.edu/6.102/www/sp26/classes/08-interfaces-subtyping/) | Behavioral subtyping, generic interfaces, and the reason a caller should depend on a contract rather than a representation. |
| 6 | Python, [`typing` — support for type hints](https://docs.python.org/3.14/library/typing.html) | Current Python surface syntax and runtime availability of typing objects. |
| 7 | Typing specification, [Generics](https://typing.python.org/en/latest/spec/generics.html) | Type variables, generic classes/functions, variance, bounds, and constraints as relationships among types. |
| 8 | Typing specification, [Protocols](https://typing.python.org/en/latest/spec/protocol.html) and [PEP 544](https://peps.python.org/pep-0544/) | Structural static subtyping and its design rationale. The specification defines current behavior; the PEP supplies historical motivation. |
| 9 | Python, [`importlib.metadata`](https://docs.python.org/3.14/library/importlib.metadata.html) | Distribution metadata and installed entry-point discovery without scanning arbitrary package internals. |
| 10 | PyPA, [Entry points specification](https://packaging.python.org/en/latest/specifications/entry-points/) | Interoperable vocabulary for entry-point groups, names, and object references used by the Atlas importer plugin registry. |

Optional rationale sources, never replacements for the current typing specification:

- [PEP 484 — Type Hints](https://peps.python.org/pep-0484/)
- [PEP 585 — Type Hinting Generics In Standard Collections](https://peps.python.org/pep-0585/)
- [PEP 695 — Type Parameter Syntax](https://peps.python.org/pep-0695/)

### Instructor synthesis and Atlas application

Teach one dependency diagram three times:

1. **Coupled version:** CLI → registry → concrete importers, while importers import registry-owned types.
2. **Contract version:** CLI → application service → `Importer[T]` protocol; concrete importers depend on domain records, not the registry.
3. **Discovery version:** an outer composition root discovers entry-point metadata, loads a candidate, validates a small runtime capability boundary, and injects it.

The central distinction to revisit is:

> discovery tells Atlas where an object is; typing describes expected relationships; application validation decides whether Atlas will trust and use it.

The module artifact is a one-page API dossier for `Importer[RawT]` containing: caller, provider, preconditions, output type, error vocabulary, side effects, compatibility promise, dependency arrows, and examples of changes hidden behind the boundary.

### Bounded GitHub/source-reading target

| Target | Exact link | Reading boundary | Question to answer | Required artifact |
|---|---|---|---|---|
| CPython high-level import helper | [`Lib/importlib/__init__.py` at CPython 3.14.6](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/importlib/__init__.py) | Read `import_module()` and only the directly called import entry point; pair with the reference pseudocode. Budget: 30–45 minutes. | How is a relative name resolved, and where does the helper hand control to the import machinery? | A six-box trace from call → resolution → machinery → module object → cache → caller binding |
| Installed entry-point query | [`Lib/importlib/metadata/__init__.py` at CPython 3.14.6](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/importlib/metadata/__init__.py) | Follow public `entry_points()` to selection and inspect `EntryPoint.load()`; do not read every distribution backend. Budget: 45 minutes. | Which steps inspect metadata, and which step imports executable code? | A trust-boundary annotation separating “discover,” “select,” “load,” and “validate” |
| Atlas plugin contract | Course-owned, generated example | Read no more than the protocol, two implementations, composition root, and one caller (target: ≤120 lines). | Which changes can each importer make without changing the caller? | Dependency-direction sketch plus two proposed contract tests |

Do **not** assign `typing.py` wholesale. The current typing specification plus a small Atlas protocol provides a much better signal-to-noise ratio.

### Safe claims to teach

- An import request involves both finding/loading a module and binding a name in a namespace; those are distinct operations.
- Importing can execute top-level module code. Successfully loaded module objects are normally cached in `sys.modules`, while reload, cache mutation, separate interpreters, and failed/partial imports make “executed exactly once forever” false.
- Circular imports can expose a partially initialized module because a module object is placed in the cache before all of its code finishes.
- A leading underscore and `__all__` communicate/export conventions; they do not create a security or access-control boundary.
- Type annotations are generally not runtime enforcement. Static checkers and other tools interpret them; Python ordinarily executes annotated code without checking argument and return types.
- Generics express relationships—for example, that an importer’s input and output types remain connected—not validation of runtime values.
- A protocol supports structural static subtyping: a type can satisfy the expected shape without nominally inheriting from the protocol.
- `@runtime_checkable` enables limited runtime instance/class checks for protocol attributes; it does not perform full static-style signature or type validation.
- Dependency inversion is a design decision about which policy owns an abstraction. Merely adding a `Protocol` does not reverse a dependency.
- Entry-point metadata standardizes discovery. Loading a discovered entry point imports code and therefore crosses a trust boundary.

### Claims not to make

- “Python annotations enforce types at runtime.”
- “A protocol is the Python equivalent of a security-enforced interface.”
- “If one type checker accepts the code, every checker must accept it.”
- “A module is imported exactly once.”
- “`__all__` makes all omitted names private.”
- “Plugins are safe because they were discovered through entry points.”
- “Dependency inversion means every class needs an interface.”
- “More generic type parameters always make an API more reusable.”

### Gap audit

| Gap or risk | Status | Course treatment |
|---|---|---|
| Python docs explain mechanisms but not dependency-inversion architecture | Intentional synthesis required | Derive dependency arrows from Atlas change pressure; label the diagram as course synthesis, not Python language law |
| Type-checker differences | Open and tool-specific | Pin one checker for exercises, show one documented disagreement only if it serves a concept, and avoid checker trivia in mastery criteria |
| Runtime plugin validation | Not solved by typing or entry-point specs | Add explicit version/capability validation and failure containment in Atlas |
| Import security and supply chain | Introduced, not exhausted | Mark as a trust boundary here; return to distribution and publisher identity in M15 |
| Public API compatibility/versioning policy | Partially covered | Record an Atlas compatibility promise now; teach release/version discipline in M15 |

**Module exit criterion:** given an import cycle and a proposed plugin API, the learner can trace runtime import behavior, identify the policy/implementation boundary, explain what static typing can and cannot guarantee, and redraw dependencies so high-level Atlas policy does not import concrete plugins.

---

## Module 13 — Specifications, testing, debugging, and observability

### Dependency role

Module 12 creates boundaries; Module 13 gives those boundaries precise meaning and evidence. It connects:

- a **specification**, which states allowed behavior;
- a **test**, which exercises a finite claim about that behavior;
- a **failure investigation**, which converts symptoms into a falsifiable cause;
- **observability signals**, which preserve enough context to investigate behavior that cannot be reproduced immediately.

The output is the safety net M14 needs for design change. It also supplies failure semantics and schema/contract tests for M15 persistence formats and M16 repositories.

### First-principles pressure

Use an ambiguous Atlas importer:

- What should a blank row mean: skip, warning, or error?
- Does one malformed record invalidate the file?
- Can duplicate identifiers occur?
- Is row order preserved?
- Which path, parser version, and record number are available when production fails?

A pile of examples cannot resolve an unstated policy. Start by having the learner sort statements into precondition, postcondition, invariant, operational detail, and observation. Then show two implementations that both pass weak tests but differ on an unspecified case. The pressure is **ambiguity plus incomplete evidence**.

### Recommended reading sequence and source contribution

| Order | Source | What it contributes |
|---:|---|---|
| 1 | MIT 6.102, [Specifications](https://web.mit.edu/6.102/www/sp26/classes/04-specifications/) | Preconditions, postconditions, behavioral equivalence, and the “firewall” between client and implementer. |
| 2 | MIT 6.102, [Designing specifications](https://web.mit.edu/6.102/www/sp26/classes/05-designing-specs/) | Stronger/weaker specs, determinism, declarative vs. operational wording, and design tradeoffs. |
| 3 | MIT 6.102, [Testing](https://web.mit.edu/6.102/www/sp26/classes/02-testing/) | Input-space partitioning, black-box/glass-box selection, unit/integration/regression distinctions, and coverage limits. |
| 4 | Python, [`unittest`](https://docs.python.org/3.14/library/unittest.html) | Standard-library test cases, fixtures, suites, subtests, and command-line discovery. |
| 5 | Python, [`unittest.mock`](https://docs.python.org/3.14/library/unittest.mock.html) | Test doubles, patching, call assertions, autospeccing, and where replacement occurs. |
| 6 | pytest, [official documentation](https://docs.pytest.org/en/stable/) | Optional ergonomic layer for assertions, fixtures, parametrization, and plugin-based test workflows. Treat it as a pinned lab tool, not Python semantics. |
| 7 | Hypothesis, [official documentation](https://hypothesis.readthedocs.io/en/latest/) | Generated examples, strategies, shrinking, and property-oriented tests. |
| 8 | MIT 6.102, [Debugging](https://web.mit.edu/6.102/www/sp26/classes/13-debugging/) | Reproduce, localize, hypothesize, test, fix, and prevent recurrence. |
| 9 | Python, [`traceback`](https://docs.python.org/3.14/library/traceback.html), [`pdb`](https://docs.python.org/3.14/library/pdb.html), and [`faulthandler`](https://docs.python.org/3.14/library/faulthandler.html) | Three evidence levels: exception stack formatting, interactive execution inspection, and low-level fault/timeout trace dumping. |
| 10 | Python, [`logging`](https://docs.python.org/3.14/library/logging.html) and [Logging HOWTO](https://docs.python.org/3.14/howto/logging.html) | Logger/handler/filter/formatter pipeline, severity, hierarchy, and library-vs-application configuration responsibilities. |
| 11 | OpenTelemetry, [observability primer](https://opentelemetry.io/docs/concepts/observability-primer/) and [specification](https://opentelemetry.io/docs/specs/otel/) | A vendor-neutral vocabulary for traces, metrics, logs, context, and semantic conventions. Use only the concepts needed to reason about Atlas boundaries. |

### Instructor synthesis and Atlas application

The teaching loop is:

1. **Claim:** Write one declarative importer contract with explicit error policy.
2. **Partition:** Divide input space by encoding validity, header validity, row validity, duplicates, and size boundary.
3. **Evidence:** Assign one unit test, one integration test, one contract test shared by implementations, one generated property, and one regression test.
4. **Failure:** Inject a one-line defect and require a minimal reproduction before use of a debugger.
5. **Observation:** Add structured context—importer name/version, source identifier, record offset, outcome, duration—without recording sensitive content.
6. **Learning:** Turn the discovered bug into a regression test and, if needed, a stronger specification.

The core diagram should show that tests are downstream of a specification and observations are evidence about execution; neither substitutes for the other.

### Bounded GitHub/source-reading target

| Target | Exact link | Reading boundary | Question to answer | Required artifact |
|---|---|---|---|---|
| `unittest` execution protocol | [`Lib/unittest/case.py` at CPython 3.14.6](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/unittest/case.py) | Follow `TestCase.run()` through setup, test method, teardown, cleanup, and result recording; inspect only one assertion helper. Budget: 60 minutes. | When are fixture failures, assertion failures, errors, skips, and cleanup failures recorded? | A lifecycle sequence diagram annotated with failure points |
| Logging dispatch | [`Lib/logging/__init__.py` at CPython 3.14.6](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/logging/__init__.py) | Trace `Logger._log()` → record creation → `handle()` → `callHandlers()`; stop before configuration utilities. Budget: 45 minutes. | Which component creates context, filters, propagates, formats, and emits? | A pipeline diagram plus one prediction about duplicate output |
| Optional pytest protocol comparison | [`src/_pytest/runner.py`](https://github.com/pytest-dev/pytest/blob/main/src/_pytest/runner.py) | Pin the release used in the lab. Trace one test through setup/call/teardown only. Budget: 30 minutes. | Which lifecycle concepts match `unittest`, and which are framework-specific? | A five-row comparison table |
| Atlas failure dossier | Course-owned failing importer | Read failing trace, relevant contract, ≤80 lines around the suspected boundary, and selected logs—never the entire project first. | What observation would falsify the current hypothesis? | Minimal reproduction, causal chain, fix, regression claim, and missing-signal note |

### Safe claims to teach

- A specification separates caller obligations from implementation obligations and makes behavioral equivalence discussable.
- A test is evidence for the cases selected or generated; it is not a proof of general correctness.
- Coverage indicates which code or branches executed under a test run. It does not establish useful assertions, adequate input partitions, or correctness.
- Unit, integration, contract, property-oriented, and regression tests answer different questions; their names do not impose one universal ratio.
- A regression test records a previously discovered failure or behavior so that the same class of change is detectable later.
- Property-based testing searches generated examples and can shrink a failing example. Passing generated cases does not prove a universally quantified theorem.
- Test doubles are useful at controlled seams. Tests that assert incidental call sequences can couple to implementation and obstruct behavior-preserving refactors.
- Patching must occur where a name is looked up, not necessarily where the original object was defined.
- A debugger accelerates inspection after a reproducible symptom and a hypothesis; it does not replace a causal model.
- Logs, traces, and metrics are complementary signals. Useful observability requires stable context, correlation, boundaries, and a data-handling policy.
- Logging an exception is not the same as recovering from it. Suppression must be an explicit contract decision.

### Claims not to make

- “One hundred percent coverage means the program is correct.”
- “Property-based testing proves the property.”
- “Unit tests are always more important than integration or contract tests.”
- “Mocks prove the real service or filesystem integration works.”
- “A failing line in a traceback is necessarily the root cause.”
- “A debugger should be the first action for every bug.”
- “If an exception was logged, it was handled.”
- “Observability means log everything.”
- “More telemetry is always better.” Sensitive data, cost, cardinality, and retention are design constraints.
- “A flaky test is merely annoying.” It corrupts the good/bad predicate used by diagnosis, review, and later `git bisect`.

### Gap audit

| Gap or risk | Status | Course treatment |
|---|---|---|
| “Contract test” terminology varies across teams | No single normative taxonomy | Define it operationally: the same behavioral suite runs against every provider of one Atlas contract |
| pytest and Hypothesis change independently of Python | Living tools | Pin exact lab versions and link their release docs; mastery focuses on test-design reasoning |
| Observability can become a platform survey | Scope risk | Stay at signal model, correlation, boundary context, and privacy; defer collectors/backends and distributed tracing implementation |
| Security/privacy of logs | Essential but domain-dependent | Require a field-by-field allowlist and redaction review in the Atlas dossier |
| Concurrency and nondeterministic testing | Not yet fully supported | Mention schedule/time dependence; defer systematic concurrency reasoning to the later concurrency arc |
| Test-oracle problem | Cannot be solved by more test syntax | Use specs, independent models, metamorphic relations, and review; label residual uncertainty |

**Module exit criterion:** given a production-like Atlas failure, the learner can strengthen the relevant specification, choose tests by the claim each test supports, produce a minimal reproduction and falsifiable hypothesis, trace the test/logging lifecycle, and identify which missing observation would have shortened diagnosis.

---

## Module 14 — Software design and change

### Dependency role

This module turns M12’s component boundaries and M13’s evidence into a disciplined change process. It connects local design choices—functions, immutable values, data-oriented transforms, classes, composition, inheritance, and state machines—to architecture, refactoring, version history, and peer review.

Its output is not allegiance to a style. It is the ability to explain:

- what change pressure a design localizes;
- which observable behavior a refactor must preserve;
- which dependency arrows enforce or violate the intended ownership;
- how commits and review make a change understandable and reversible.

M15 consumes this discipline when the software gains users and releases. M16 uses the same ideas to introduce `ImportValidatedBundle` and a repository contract that keep storage details outside planning/domain policy.

### First-principles pressure

Use a coupled Atlas prototype with four change requests:

1. Add a new ranking policy.
2. Preserve an old CLI output field for one release.
3. Retry one importer failure but never retry invalid data.
4. Add the plan-state transitions `draft → validated → published`.

Ask the learner to predict the files and tests each request touches. If every change crosses the same central class, the issue is not “missing a pattern”; it is that unrelated decisions share ownership. Derive design from **axes of change, state invariants, and dependency direction**. Introduce pattern names only after the learner has independently found the force they address.

### Recommended reading sequence and source contribution

| Order | Source | What it contributes |
|---:|---|---|
| 1 | MIT 6.102, [Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) | Representation independence and the boundary that allows internal design to change. |
| 2 | MIT 6.102, [Interfaces and subtyping](https://web.mit.edu/6.102/www/sp26/classes/08-interfaces-subtyping/) | Substitutability and the behavioral obligations behind composition or inheritance. |
| 3 | MIT 6.102, [Functional programming](https://web.mit.edu/6.102/www/sp26/classes/10-functional-programming/) | Functions as values and transformation pipelines as an alternative decomposition. |
| 4 | MIT 6.102, [Code review](https://web.mit.edu/6.102/www/sp26/classes/03-code-review/) | Systematic examination of readability, assumptions, simplicity, and defects; review as learning as well as gatekeeping. |
| 5 | MIT 6.005, [reading index](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/pages/readings/) | Stable comparative material on ADTs, representation invariants, interfaces, code review, version control, and team version control. |
| 6 | Martin Fowler, [Catalog of Refactorings](https://refactoring.com/catalog/) | Author-maintained names and sketches for small transformations. Use a few transformations as vocabulary, not a catalog to memorize. |
| 7 | MIT 6.102, [Git 1: version control](https://web.mit.edu/6.102/www/sp26/tools/git-1-version-control/) | Undergraduate introduction to history as a graph, diffs, versions, and a solo workflow. |
| 8 | Pro Git, [Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and [Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) | First-principles object/commit/reference model behind branches, merges, and history. |
| 9 | Git reference, [`git diff`](https://git-scm.com/docs/git-diff), [`git log`](https://git-scm.com/docs/git-log), and [`git bisect`](https://git-scm.com/docs/git-bisect) | Exact command contracts for inspecting change and using a good/bad predicate to localize a regression. |
| 10 | Google Engineering Practices, [code review guide](https://google.github.io/eng-practices/review/), [review standard](https://google.github.io/eng-practices/review/reviewer/standard.html), and [what to look for](https://google.github.io/eng-practices/review/reviewer/looking-for.html) | A primary, public example of organizational review practice: design, functionality, complexity, tests, names, comments, style, and docs. It is a case study, not universal policy. |

Optional Git depth:

- [Distributed workflows](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows)
- [`git merge`](https://git-scm.com/docs/git-merge)
- [`git rebase`](https://git-scm.com/docs/git-rebase)
- [Plumbing and porcelain](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)

### Instructor synthesis and Atlas application

Teach design as a decision record rather than a pattern quiz. For each proposed refactor, the learner fills five fields:

1. **Pressure:** what future change or present defect is expensive?
2. **Invariant/contract:** what must remain observable?
3. **Ownership:** which component should know this decision?
4. **Transformation:** what is the smallest reviewable change?
5. **Evidence:** which tests, types, traces, and manual checks protect it?

Atlas’s coupled `Application` prototype is refactored in this reading order:

> public contract → domain data and invariants → control/error flow → tests → dependency graph → mechanics.

The learner first reviews the code without editing it, reconstructs a state machine, predicts change amplification, and then compares three candidate decompositions: functional pipeline, composed service objects, and data-oriented dispatch table. The course selects one for Atlas but makes the rejected tradeoffs explicit.

### Bounded GitHub/source-reading target

| Target | Exact link | Reading boundary | Question to answer | Required artifact |
|---|---|---|---|---|
| Git object model | [Pro Git: Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) | Read blobs, trees, commits, and references; run only read-only plumbing demonstrations in a disposable repo. Budget: 60 minutes. | Why is a commit not “a diff,” and why is a branch cheap? | Object graph linking working tree, index, tree, commit, parent, and ref |
| Bisect contract | [`Documentation/git-bisect.adoc` in Git](https://github.com/git/git/blob/master/Documentation/git-bisect.adoc) | Pin the Git release used in class. Read command synopsis, good/bad semantics, and automated-run behavior. Do not read Git’s C implementation. | What properties must a test command have to be a trustworthy bisect predicate? | Predicate checklist covering determinism, exit status, environment, and skipped commits |
| Review-guide provenance | [`google/eng-practices`](https://github.com/google/eng-practices) | Read the overview and one reviewer page; inspect repository history for one policy wording change. Budget: 30 minutes. | Which advice is a portable reasoning principle and which is Google-specific process? | Two-column “principle / local policy” note |
| Atlas refactor patch | Course-owned before/after commit | Read API/spec first, then diff, then surrounding call sites; cap diff at roughly 150 changed lines. | Did the patch preserve the chosen observable behavior and improve the named change pressure? | Structured review with contract risk, design risk, test gap, and one clarifying question |

### Safe claims to teach

- Refactoring aims to change internal structure while preserving externally observable behavior under a chosen specification. Tests support that claim but do not prove it.
- Composition, inheritance, functional decomposition, and data-oriented design are tools with different coupling, state, and extension tradeoffs.
- Inheritance creates a behavioral subtype obligation, not merely code reuse.
- A state machine is useful when legal transitions and state-dependent behavior are central; a class hierarchy is not automatically the clearest representation of state.
- A design pattern names recurring forces and a family of solutions. It is a reasoning vocabulary, not a mandatory template.
- Git commits form a directed acyclic graph through parent links. A branch is a movable reference to a commit.
- The working tree, index, and `HEAD` are distinct states; understanding them explains many apparently surprising Git commands.
- A useful commit tells one coherent change story and leaves the repository in a reviewable state, but “small” alone does not make a change safe.
- Code review should inspect the diff in the context of contracts, callers, tests, data flow, error behavior, and architecture.
- `git bisect` can localize a transition only when “good” and “bad” can be classified reproducibly; flaky tests or unbuildable intermediate commits can mislead it.

### Claims not to make

- “Never use inheritance.”
- “Composition is always better.”
- “DRY is an absolute rule.” Removing coincidental duplication can create harmful coupling.
- “Every design problem has a named pattern.”
- “Using patterns makes architecture good.”
- “Rebase is always cleaner” or “merge commits are bad.” History policy depends on collaboration and audit needs.
- “Git is a backup by itself.” A local repository can be lost with the machine.
- “Green CI means the review is complete.”
- “Code review guarantees defects will be caught.”
- “A smaller diff is automatically lower risk.”
- “Refactoring cannot change performance or operational behavior.” The chosen observable contract must state whether those matter.

### Gap audit

| Gap or risk | Status | Course treatment |
|---|---|---|
| No single source provides a Python-specific architecture doctrine | Intentional | Use language-neutral principles plus Atlas alternatives; never present one style as Python law |
| Design patterns can become vocabulary theater | High pedagogy risk | Name a pattern only after deriving its pressure and show at least one simpler non-pattern alternative |
| Refactoring equivalence is specification-relative | Essential nuance | Require the learner to list preserved and deliberately changed observations before reading the diff |
| Git hosting-platform workflows | Product-specific and volatile | Teach Git’s object graph and commands first; defer platform buttons and organization policy |
| Code-review evidence is partly experiential | Not a formal guarantee | Use Google as one primary process case and MIT for pedagogy; distinguish policy from empirically proven universal law |
| Large legacy change | Beyond one module | Teach seams and staged migration on a bounded Atlas patch; defer organization-scale modernization |

**Module exit criterion:** given a coupled Atlas feature and a proposed patch, the learner can reconstruct its contracts and state transitions, compare at least two decompositions, explain dependency ownership, review the patch from evidence rather than taste, and use the Git graph to locate or reverse a faulty change.

---

## Module 15 — Files, serialization, packaging, and delivery

### Dependency role

Module 15 moves Atlas beyond process lifetime and a developer checkout. It joins four boundaries that are often taught separately:

- **representation boundary:** Python objects become bytes or text;
- **resource boundary:** files and other resources must be acquired and released through failure;
- **compatibility boundary:** persisted schemas and command-line behavior survive software versions;
- **distribution boundary:** source becomes a built artifact that another environment can install and execute.

Module 12 supplies the public API and plugin model, M13 supplies contract/security tests and observable failures, and M14 supplies release-sized changes. Module 16 will replace some file persistence with transactional storage, so M15 must make the distinction between serialization and database persistence explicit.

### First-principles pressure

Begin with an Atlas export that “works on my machine” but fails under realistic conditions:

1. It writes text using an implicit locale encoding.
2. A process dies after truncating the old file and before completing the new one.
3. A renamed field makes last month’s JSON unreadable.
4. An attacker supplies a pickle or a path-traversal archive.
5. A wheel installs on one machine but is incompatible with another.
6. A transitive dependency changes between two deployments.

The pressure is **boundary ambiguity over time and trust**. Every durable format needs an encoding, grammar/schema, version, validation policy, size/resource limits, migration strategy, and failure semantics. Every release needs a declared build interface, metadata, compatibility envelope, dependency policy, and provenance.

### Recommended reading sequence and source contribution

| Order | Source | What it contributes |
|---:|---|---|
| 1 | Python, [`open()`](https://docs.python.org/3.14/library/functions.html#open) and [`io`](https://docs.python.org/3.14/library/io.html) | Text/binary streams, buffering, encodings, errors, newlines, seekability, and stream capability layers. |
| 2 | Python, [Unicode HOWTO](https://docs.python.org/3.14/howto/unicode.html) | Code points, encodings, decode/encode boundaries, normalization concerns, and Unicode-aware processing. |
| 3 | Python data model, [Context managers](https://docs.python.org/3.14/reference/datamodel.html#context-managers) and [`contextlib`](https://docs.python.org/3.14/library/contextlib.html) | `__enter__`/`__exit__`, exception propagation/suppression, generator-based context managers, and deterministic cleanup. |
| 4 | Python, [`json`](https://docs.python.org/3.14/library/json.html), [`pickle`](https://docs.python.org/3.14/library/pickle.html), and [`tomllib`](https://docs.python.org/3.14/library/tomllib.html) | Contrasting data models, interoperability, parsing limits, Python-specific object reconstruction, and configuration parsing. |
| 5 | Python, [`pathlib`](https://docs.python.org/3.14/library/pathlib.html), [`zipfile`](https://docs.python.org/3.14/library/zipfile.html), and [`tarfile` extraction filters](https://docs.python.org/3.14/library/tarfile.html#extraction-filters) | Path semantics and archive extraction as explicit filesystem trust boundaries. |
| 6 | Python, [`argparse`](https://docs.python.org/3.14/library/argparse.html) | Stable CLI grammar, help/error behavior, subcommands, and machine-vs-human output decisions. |
| 7 | PyPA, [`pyproject.toml` specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/) | Separation of `[build-system]`, standardized `[project]` metadata, and namespaced `[tool]` configuration. |
| 8 | PyPA, [Core metadata](https://packaging.python.org/en/latest/specifications/core-metadata/) and [Dependency specifiers](https://packaging.python.org/en/latest/specifications/dependency-specifiers/) | The metadata carried into distributions: project identity, Python compatibility, requirements, extras, markers, and versions. |
| 9 | PyPA, [Wheel binary distribution format](https://packaging.python.org/en/latest/specifications/binary-distribution-format/) | Wheel archive structure, `WHEEL`/`METADATA`/`RECORD`, and compatibility tags. |
| 10 | PyPA, [Packaging Python Projects tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/) and [`build`](https://build.pypa.io/en/stable/) | Maintained end-to-end workflow and the distinction between a build frontend and backend. |
| 11 | pip, [Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/) | Version pinning, hash checking, wheelhouses, and the limits of portability/repeatability. |
| 12 | PyPI, [Trusted Publishers](https://docs.pypi.org/trusted-publishers/) | OIDC-based release identity and short-lived publishing credentials as one supply-chain control. |

### Instructor synthesis and Atlas application

Teach one “durable boundary record” for both saved data and built distributions:

| Boundary question | Atlas state file | Atlas wheel |
|---|---|---|
| Identity/version | `schema_version` | project version and metadata version |
| Structure | JSON object schema | wheel archive plus `.dist-info` files |
| Compatibility | reader/migration range | Python/ABI/platform tags and `Requires-Python` |
| Integrity | application validation, optional external digest | internal `RECORD` manifest/hashes; an external digest/provenance policy is still needed to authenticate the artifact |
| Trust | source and size limits | publisher, index, build, dependency, and installer trust |
| Failure | reject, recover, or migrate | build/install failure with no silent fallback |

The Atlas deliverable is an installable CLI with:

- explicit UTF-8 durable data and an intentionally versioned schema;
- a migration function tested from one prior version;
- safe write strategy documented with platform assumptions;
- stable exit codes and separate human/machine output;
- a minimal `pyproject.toml`;
- an inspected sdist and wheel;
- a release checklist that records runtime, build frontend/backend, dependency resolution, hashes/provenance, and rollback.

### Bounded GitHub/source-reading target

| Target | Exact link | Reading boundary | Question to answer | Required artifact |
|---|---|---|---|---|
| Generator context manager | [`Lib/contextlib.py` at CPython 3.14.6](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/contextlib.py) | Read `@contextmanager` and `_GeneratorContextManager.__enter__`/`__exit__`; ignore async and stack utilities initially. Budget: 45 minutes. | How do normal return, body exception, generator exception, and suppression interact? | A four-path control-flow diagram |
| Packaging reference project | [`pypa/sampleproject`](https://github.com/pypa/sampleproject) | Pin a commit. Read `pyproject.toml`, package `__init__.py`, README packaging commands, and tests only. Do not copy configuration blindly. | Which fields are standard metadata, backend-specific, or project convention? | Annotated `pyproject.toml` with source for each conclusion |
| Built artifacts | Learner-built Atlas sdist and wheel, interpreted using the [wheel spec](https://packaging.python.org/en/latest/specifications/binary-distribution-format/) | List archive members; inspect `METADATA`, `WHEEL`, `entry_points.txt` if present, and `RECORD`. Do not decompile dependencies. Budget: 45 minutes. | What changed between source tree, sdist, wheel, installed files, and import package? | Five-column artifact map and one compatibility prediction |
| Migration-aware file write | Course-owned Atlas example | Read serializer, validator, migration table, and write boundary only (≤150 lines). | At which point can old data be rejected, migrated, partially written, or lost? | Failure timeline including temp file, flush, replace, and recovery assumptions |

Do not make `pickle` internals an initial source-reading assignment. Its security model is better learned from the official warning, a harmless opcode demonstration in an isolated lab, and a format-selection decision.

### Safe claims to teach

- Python `str` represents Unicode text; files and networks ultimately carry bytes. Encoding and decoding are explicit conceptual boundaries even when an API supplies defaults.
- Durable text formats should choose an encoding and error/newline policy explicitly. The platform default encoding is not universally UTF-8 in every supported Python 3.14 environment.
- A context manager establishes an enter/exit protocol and can guarantee that exit logic is attempted when control leaves the block. It does not guarantee that cleanup succeeds, a disk is durable, or a multi-step update is atomic.
- JSON is a text interchange format with a limited data model. Parsing valid JSON does not validate Atlas’s domain schema or business invariants.
- Untrusted JSON still needs limits and validation for size, depth, numbers, and application-specific fields.
- `pickle` is Python-specific and unsafe for untrusted or tamperable data because unpickling can execute arbitrary code.
- Serialization is not the same as persistence: naming, concurrency, migration, durability, and recovery remain application/system concerns.
- A write-temp/flush/replace strategy can reduce partial-update risk, but atomicity and crash durability depend on OS, filesystem, directory syncing, hardware, and error handling. State assumptions explicitly.
- `pyproject.toml` has standardized `[build-system]`, `[project]`, and `[tool]` roles. Choosing a backend does not redefine the wheel format.
- A wheel is a ZIP-format built distribution with metadata and compatibility tags. Some wheels are platform-specific, and an apparently pure-Python tag does not make all runtime dependencies portable.
- Build frontend, build backend, installer, package index, and environment resolver are separate participants.
- Pinning versions and checking hashes improve repeatability/integrity under stated conditions; they do not guarantee availability, benign code, or identical behavior across every platform.
- Trusted Publishing reduces long-lived release-secret exposure; it does not prove the released code is correct or dependency chain is safe.

### Claims not to make

- “Python always opens text files as UTF-8.”
- “Unicode means every visually identical string compares equal.”
- “`with open(...)` makes a write atomic and durable.”
- “JSON is safe, therefore any JSON document is safe to process.”
- “JSON validates a schema.”
- “Pickle is safe if the file is encrypted or came through an authenticated endpoint.” Trust and tamper assumptions must be explicit; the format still has code-execution capability.
- “A wheel is portable everywhere.”
- “Wheels contain no executable code.”
- “`pyproject.toml` completely specifies a reproducible environment.”
- “All Python tools share one standardized lock-file behavior.” A standard `pylock.toml` specification exists, but tool adoption and workflow semantics must be audited rather than assumed.
- “`pip freeze` alone gives universal reproducibility.”
- “A hash proves a package is trustworthy.” It proves identity relative to the expected digest.

### Gap audit

| Gap or risk | Status | Course treatment |
|---|---|---|
| Schema language for Atlas JSON | No stdlib JSON Schema validator | Use a small course-owned validator first; optionally compare JSON Schema later without making it a dependency |
| Cross-platform crash consistency | Deep systems topic | Document assumptions, simulate interruption, and distinguish process atomicity from storage durability; avoid universal guarantees |
| Archive extraction attacks | Library/version-sensitive | Use current extraction-filter docs and a small hostile-name review; never use an old snippet without re-audit |
| Packaging ecosystem changes rapidly | High freshness risk | Store exact Python, PyPA spec revision, frontend/backend, pip, and build command with every lab |
| Dependency locking | Tool- and deployment-specific | Teach requirement metadata vs resolved environment first; choose and pin a single course workflow only after that distinction |
| Software supply chain | Larger than one module | Cover publisher identity, hashes, isolated builds, minimal permissions, and artifact inspection; defer full SLSA/SBOM policy |
| CLI compatibility | Not completely standardized by `argparse` | Course defines exit-code, stdout/stderr, machine-output, and deprecation policies explicitly |

**Module exit criterion:** given an Atlas file format and wheel, the learner can trace objects to text/bytes and back, identify encoding/schema/trust/migration boundaries, reason through failure paths in a context manager and file update, inspect packaging metadata and compatibility tags, and distinguish repeatability, integrity, provenance, and correctness.

---

## Module 16 — Relational data and transactions

### Dependency role

Module 16 replaces ad hoc persistence with a model for shared durable state. It connects three layers:

- the **logical layer:** relations, keys, functional dependencies, normalization, relational algebra, and SQL result meaning;
- the **physical layer:** pages, indexes, access paths, operators, statistics, and query plans;
- the **transactional layer:** atomicity, consistency constraints, isolation, durability, concurrency control, logging, and recovery.

M15 taught that a file format needs versioning and failure semantics. M16 explains why a set of interdependent updates cannot safely be treated as unrelated file writes. The module also preserves M12’s dependency direction: Atlas depends on a repository/transaction contract; `sqlite3` or a later server adapter implements it.

### First-principles pressure

Start with one denormalized Atlas table:

`resource_id, resource_title, owner_email, owner_department, tag, import_run, importer_version, rank`

Then apply real changes:

- an owner changes department;
- a resource has three tags;
- one import run updates resources and rankings but crashes halfway;
- two processes claim the same queued job;
- a query filters by owner and recent import but an index is ignored;
- a retry under serializable isolation aborts again.

Derive:

1. relations and keys from identity;
2. functional dependencies and anomalies from redundancy;
3. lossless decomposition and dependency preservation from reconstruction requirements;
4. relational algebra/SQL from declarative result sets;
5. indexes and plans from the cost of locating rows;
6. transactions and isolation from multi-step invariants and interleavings;
7. WAL/recovery from the gap between volatile execution and durable pages.

### Recommended reading sequence and source contribution

| Order | Source | What it contributes |
|---:|---|---|
| 1 | CMU 15-445, [Fall 2025 syllabus](https://15445.courses.cs.cmu.edu/fall2025/syllabus.html) and [schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) | Complete university dependency order: relational model/SQL → storage → indexes → execution/optimization → concurrency → recovery. |
| 2 | CMU 15-445, [Relational Model & Algebra slides](https://15445.courses.cs.cmu.edu/fall2025/slides/01-relationalmodel.pdf) | Relations, tuples, keys, integrity constraints, and relational-algebra operators. Use with original Atlas exercises rather than reproducing slide decks. |
| 3 | Berkeley CS 186, [Database Design](https://cs186berkeley.net/notes/note13/) | Functional dependencies, closure, candidate keys, BCNF, lossless decomposition, and the reason redundancy creates anomalies. |
| 4 | PostgreSQL 18, [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | Concrete `CHECK`, `NOT NULL`, `UNIQUE`, primary-key, foreign-key, and referential-action behavior, including NULL and index nuances. |
| 5 | Python 3.14, [`sqlite3`](https://docs.python.org/3.14/library/sqlite3.html) | DB-API use, parameter binding, connection/cursor contracts, context manager, and current `autocommit` vs legacy transaction control. |
| 6 | SQLite, [Foreign Key Support](https://www.sqlite.org/foreignkeys.html) | A second engine’s referential integrity and the critical requirement to enable foreign-key enforcement per connection in typical builds. |
| 7 | PostgreSQL 18, [Indexes](https://www.postgresql.org/docs/18/indexes.html) and CMU, [Index notes](https://15445.courses.cs.cmu.edu/fall2025/notes/08-indexes1.pdf) | Index structures as derived access paths with read benefits and write/space costs. |
| 8 | Berkeley CS 186, [Query Optimization](https://cs186berkeley.net/notes/note10/) | Logical-to-physical planning, join orders, cardinality/cost estimates, and optimizer search. |
| 9 | PostgreSQL 18, [Using `EXPLAIN`](https://www.postgresql.org/docs/18/using-explain.html), plus SQLite [Query Planner](https://www.sqlite.org/queryplanner.html) and [`EXPLAIN QUERY PLAN`](https://www.sqlite.org/eqp.html) | Concrete, contrasting plan trees; estimates vs actual behavior; engine/version dependence of plan output. |
| 10 | PostgreSQL 18, [Transactions tutorial](https://www.postgresql.org/docs/18/tutorial-transactions.html), [MVCC introduction](https://www.postgresql.org/docs/18/mvcc-intro.html), and [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Atomic groups, snapshots, SQL phenomena, PostgreSQL-specific isolation guarantees, and serialization failures/retries. |
| 11 | Berkeley CS 186, [Transactions & Concurrency](https://cs186berkeley.net/notes/note11/) | Interleavings, serializability, locking, and conceptual concurrency-control mechanisms. |
| 12 | SQLite, [Transactions](https://www.sqlite.org/lang_transaction.html) and [Isolation](https://www.sqlite.org/isolation.html) | Embedded-engine transaction modes, multiple readers/single writer, snapshots, `SQLITE_BUSY`, and journaling-mode differences. |
| 13 | PostgreSQL 18, [Write-Ahead Logging](https://www.postgresql.org/docs/18/wal-intro.html), Berkeley CS 186 [Recovery](https://cs186berkeley.net/notes/note14/), and SQLite [Atomic Commit](https://www.sqlite.org/atomiccommit.html) | Write-ahead ordering, redo/recovery concepts, and a concrete filesystem-aware atomic-commit account. |
| 14 | SQLite, [Write-Ahead Logging](https://www.sqlite.org/wal.html) | SQLite-specific WAL concurrency, checkpointing, operational tradeoffs, and failure modes. It must not be conflated with PostgreSQL WAL. |

### Instructor synthesis and Atlas application

Use one invariant across the whole module:

> Every published ranking references an existing resource and import run, and an import run is either fully applied or not applied.

Re-express it at each layer:

- **conceptual:** entity relationships and ownership;
- **relational:** primary/foreign keys and functional dependencies;
- **SQL:** schema constraints and a transaction boundary;
- **physical:** indexes supporting the actual lookup and join predicates;
- **concurrent:** two-connection schedule and allowed observations;
- **recovery:** which log/page ordering preserves the committed result after a crash;
- **Python adapter:** parameterized statements, explicit transaction mode, retry classification, and connection lifecycle.

The Atlas project migrates one versioned JSON snapshot into SQLite, verifies counts and invariants, runs before/after query plans, and simulates two connections. PostgreSQL documentation is used to compare behaviors, not to require a second deployed database during the first pass.

### Bounded GitHub/source-reading target

| Target | Exact link | Reading boundary | Question to answer | Required artifact |
|---|---|---|---|---|
| Python DB-API wrapper | [`Lib/sqlite3/dbapi2.py` at CPython 3.14.6](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/sqlite3/dbapi2.py) | Read public constants, connection setup surface, adapters/converters registration, and imports into the C extension. Pair with docs; do not infer C behavior from this thin wrapper. Budget: 30 minutes. | Which behavior lives in Python, in the extension, or in the linked SQLite library? | Three-layer ownership table |
| Educational executor | [BusTub repository](https://github.com/cmu-db/bustub), [`seq_scan_executor.h`](https://github.com/cmu-db/bustub/blob/master/src/include/execution/executors/seq_scan_executor.h), and [`seq_scan_executor.cpp`](https://github.com/cmu-db/bustub/blob/master/src/execution/seq_scan_executor.cpp) | Pin a commit. Read only the plan/executor interface and sequential-scan implementation; do not undertake a CMU project or publish solutions. Budget: 60 minutes. | How does a logical scan request become an iterator-like producer of tuples? | Plan → executor → table/index/catalog dependency diagram |
| PostgreSQL executor architecture | [`src/backend/executor/README`](https://github.com/postgres/postgres/blob/master/src/backend/executor/README) | Pin the PostgreSQL 18 tag and read overview/plan-state execution model only; do not follow every node implementation. Budget: 45 minutes. | What recurring execution protocol lets different physical operators compose into a plan tree? | One-page comparison with Atlas iterators and BusTub |
| Engine-generated plans | PostgreSQL [`EXPLAIN`](https://www.postgresql.org/docs/18/using-explain.html) and SQLite [`EXPLAIN QUERY PLAN`](https://www.sqlite.org/eqp.html) | Use one Atlas query before/after one index, fixed data generator, saved schema, statistics step, engine version, and plan output. | Why might the optimizer choose a scan despite an available index? | Evidence table: predicate, cardinality, index, estimate, selected plan, measured time |

**Academic-integrity boundary:** BusTub is an educational repository whose maintainers explicitly prohibit publishing course-project solutions. This course uses only public framework reading and original Atlas exercises. It does not copy CMU assignments, solutions, or autograder work.

### Safe claims to teach

- In relational theory, a relation is a set of tuples. SQL tables and query results can admit duplicate rows unless constraints or query operators prevent them, so mathematical relation semantics must not be casually equated with every SQL or physical-table behavior.
- A key identifies rows under stated semantics. Primary-key, unique, and foreign-key constraints encode important invariants at the database boundary, but they cannot express every domain rule.
- A functional dependency is a claim about all legal states of a relation, not a pattern guessed from one current dataset.
- Normalization uses dependencies to reduce redundancy and update/insert/delete anomalies. A decomposition must also be evaluated for losslessness and, where required, dependency preservation.
- Denormalization can be a deliberate, measured tradeoff; it is not automatically wrong.
- SQL states desired results while the optimizer selects a physical plan from available operators/access paths. Equivalent logical queries can receive different plans.
- An index is a maintained derived structure that trades space and write work for possible read benefits. The optimizer may rationally ignore an available index.
- `EXPLAIN` plans and cost estimates depend on engine version, statistics, data distribution, configuration, and query parameters. `EXPLAIN ANALYZE` executes the statement and must be used carefully for writes.
- ACID names properties of a transaction contract and its implementation mechanisms. It is not a promise of zero loss under every hardware, configuration, operator, or disaster scenario.
- Isolation levels rule out specified phenomena; products may provide guarantees stronger than the SQL minimum and may use different mechanisms.
- PostgreSQL’s Repeatable Read prevents phantom reads even though the SQL minimum permits them, and PostgreSQL Serializable transactions can abort with serialization failures that applications must be prepared to retry.
- SQLite generally serializes writes and allows multiple readers; rollback-journal and WAL modes expose different reader/writer behavior. `SQLITE_BUSY` is an operational possibility, not proof that transactions failed conceptually.
- In Python 3.14, `sqlite3.Connection.autocommit` currently defaults to `LEGACY_TRANSACTION_CONTROL`, while the documentation recommends explicit `autocommit=False` for PEP 249-style control. This is version-sensitive.
- A `sqlite3.Connection` context manager commits or rolls back an open transaction according to exit outcome; it neither opens a transaction solely by entering nor closes the connection.
- SQLite foreign-key enforcement is disabled by default in typical builds and must be enabled per connection; the lab must assert the PRAGMA rather than assume it.
- Write-ahead logging requires log information to reach durable storage before corresponding data-page changes. PostgreSQL WAL and SQLite WAL share a broad idea but differ in architecture, files, concurrency, checkpointing, and operations.
- A WAL is not, by itself, a backup. Recovery objectives require a tested backup/restore and retention strategy.

### Claims not to make

- “Putting data in a transaction makes application code race-free.”
- “Serializable means transactions never abort or need retries.”
- “Read Committed or Repeatable Read means exactly the same behavior in every database.”
- “An index always speeds up a query.”
- “A foreign key automatically creates every useful index.” For example, PostgreSQL does not automatically index the referencing columns.
- “SQLite always enforces declared foreign keys without configuration.”
- “Normalization means every production database should be in the highest normal form.”
- “A query plan predicts exact runtime.”
- “The SQL text determines join order.”
- “ACID guarantees no data loss under any conceivable hardware failure.”
- “WAL is just a log file and works the same in PostgreSQL and SQLite.”
- “SQLite is a toy” or “PostgreSQL is always the better choice.” Workload, deployment, operations, concurrency, and failure requirements decide.
- “The Python connection context manager closes the connection.”

### Gap audit

| Gap or risk | Status | Course treatment |
|---|---|---|
| Full relational theory | Intentionally bounded | Cover keys, FDs, closure, BCNF/3NF comparison, lossless join, dependency preservation, and core algebra; defer formal proof depth beyond what supports design reasoning |
| SQL standard vs product dialect | Essential distinction | Mark each claim as relational/SQL concept, PostgreSQL 18 behavior, SQLite behavior, or Python wrapper behavior |
| PostgreSQL `/current/` drift | Resolved for authored links | Lessons use `/docs/18/`; re-pin if the lab upgrades |
| SQLite build/configuration variation | High operational risk | Record `sqlite3.sqlite_version`, compile options where relevant, `foreign_keys`, journal mode, and autocommit setting in every experiment |
| Cost-model depth | Bounded | Read plans and estimate errors; do not require optimizer implementation |
| Recovery experiment safety | Requires care | Use disposable databases and injected process termination; never simulate disk failure against user data |
| Distributed transactions/replication | Out of scope | State explicitly; later systems modules may cover them |
| ORM abstraction | Deliberately deferred | Learn relations, SQL, plans, and transactions first so an ORM can later be read rather than trusted as magic |

**Module exit criterion:** given a denormalized Atlas schema and a two-connection schedule, the learner can derive dependencies and a lossless design, express core invariants with constraints, predict and inspect access paths, distinguish logical results from physical plans, explain allowed isolation observations for the named engine, and trace commit/recovery responsibilities from Python code to the database.

---

## Source-to-session routing

This routing prevents “read everything” assignments and preserves the conceptual chain.

| Module | Before class (30–60 min) | Instructor session | TA / study-partner session | Mastery evidence |
|---|---|---|---|---|
| 12 | MIT ADT sections; Python import tutorial; protocol overview | Reconstruct import/cache/binding model; derive plugin boundary from change amplification | Trace bounded `importlib` and entry-point paths; critique a proposed `Protocol` | Explain import cycle, dependency arrows, static/runtime limits, and plugin trust boundary |
| 13 | MIT specification and testing sections | Turn importer ambiguity into spec + input partitions + layered evidence | Minimal-reproduction clinic; trace test lifecycle/logging propagation | Failure dossier with claim, evidence, cause, regression, and missing observation |
| 14 | MIT review; Pro Git branch/object sections | Compare three decompositions and derive a state machine | Review a bounded Atlas patch; run a deterministic bisect exercise | Architecture decision record plus evidence-based code review |
| 15 | Unicode/I/O/context-manager docs; packaging tutorial | Follow object → text/bytes → versioned schema → built artifact | Inspect context-manager control flow and wheel metadata; rehearse failed migration/release | Durable-boundary record and inspected installable CLI |
| 16 | CMU relational-model material; Berkeley normalization note | Derive schema/algebra/constraints from one invariant | Two-connection schedule, plan-reading lab, transaction-mode audit | Schema + plans + isolation explanation + recovery responsibility map |

### Retrieval-practice design

Multiple-choice diagnostics should test models rather than syntax trivia. Each distractor should encode a plausible misconception:

- M12: confuse discovery, load, binding, static conformance, and runtime trust;
- M13: confuse coverage with correctness, symptom with cause, or a mock with real integration;
- M14: confuse refactoring with feature change, branch with commit, or policy with universal law;
- M15: confuse text with bytes, cleanup with durability, or metadata with a resolved environment;
- M16: confuse logical equivalence with physical plan, isolation guarantee with engine mechanism, or WAL with backup.

After each selection, require a one-sentence causal explanation or a counterexample. This keeps the interaction fast while testing depth.

## Arc-wide bounded source-reading ladder

The sequence deliberately grows from a tiny façade to a real database execution architecture:

1. `importlib.import_module()` — one public helper crossing into machinery.
2. `unittest.TestCase.run()` — a lifecycle with explicit outcomes.
3. logging dispatch — a composed pipeline with hierarchy and propagation.
4. Git object documentation — persistent graph and references without implementation noise.
5. `contextlib` generator protocol — control flow through normal and exceptional exits.
6. wheel metadata — architecture visible in a built artifact rather than source alone.
7. Python `sqlite3` wrapper — boundary among Python, extension, and embedded library.
8. BusTub sequential executor and PostgreSQL executor overview — composable physical-plan architecture.

For every target, the learner follows the same protocol:

1. State the question before opening code.
2. Read the public contract and one test/example first.
3. Sketch components and control/data flow.
4. Predict one behavior.
5. Trace only enough code or metadata to confirm or revise it.
6. Record an uncertainty and the next source that would resolve it.
7. Stop at the stated boundary.

## Coverage and gap audit

| Required topic | Primary coverage | Secondary/operational coverage | Residual gap |
|---|---|---|---|
| Modules/imports | Python import reference and tutorial | CPython `importlib` bounded trace | Custom import hooks are acknowledged, not implemented |
| Public APIs/information hiding | MIT ADTs/interfaces | Atlas API dossier | Semantic versioning policy completed in M15 |
| Typing/generics/protocols | Typing specification, PEP 544 | Python `typing` docs and Atlas plugin | Checker-specific advanced edge cases excluded |
| Dependency direction | MIT abstraction/subtyping principles | Course-owned dependency diagrams | No claim that Python defines one architecture doctrine |
| Specifications/testing | MIT 6.102 | `unittest`, pytest, Hypothesis | Formal verification beyond scope |
| Debugging/observability | MIT debugging, Python traceback/pdb/logging | OpenTelemetry concepts | Production telemetry backend and distributed traces deferred |
| Design/refactoring | MIT software construction and Fowler catalog | Atlas alternatives and patch review | Organization-scale legacy modernization deferred |
| Version control/review | Pro Git/Git docs, MIT, Google guide | Bounded bisect/review exercises | Hosting-platform administration excluded |
| Files/encodings/context managers | Python docs | CPython `contextlib` trace | Filesystem crash semantics kept assumption-specific |
| Serialization/security | Python JSON/pickle/archive docs | Atlas schema/migration lab | Comprehensive untrusted-parser security is larger than module |
| `pyproject`/wheels/dependencies/releases | PyPA specs, pip, PyPI | Sampleproject and artifact inspection | One course toolchain must be pinned at delivery time |
| Relational model/normalization/algebra | CMU 15-445, Berkeley CS 186 | Atlas derivations | Deeper dependency theory and proof exercises optional |
| SQL/indexes/query plans | PostgreSQL/SQLite docs, CMU/Berkeley | Saved `EXPLAIN` comparisons | Engine internals intentionally sampled, not exhaustive |
| ACID/isolation/recovery | PostgreSQL/SQLite docs, Berkeley recovery | Two-connection/crash labs | Replication and distributed transactions deferred |

### Deliberate deferrals

- asynchronous and concurrent Python programming beyond the database schedules needed for M16;
- networking, web APIs, authentication, and deployment orchestration;
- full static-type theory and checker implementation;
- formal methods/model checking;
- distributed tracing infrastructure;
- ORM frameworks;
- distributed databases, consensus, replication, and two-phase commit;
- full software-supply-chain frameworks.

These are deferrals, not omissions: Arc III builds the contracts, evidence, persistence, and transaction models needed to understand them later.

## Instructor freshness checklist

Run this checklist before generating or teaching the Arc III lessons:

- [ ] Record audit date, host OS, Python implementation, exact Python patch, and `sqlite3.sqlite_version`.
- [ ] Replace the CPython `3.14` branch links used in source-reading handouts with the exact tag or commit matching the learner’s runtime.
- [ ] Recheck the Python import, typing, `sqlite3`, context-manager, serialization, and archive-extraction pages for changed warnings or defaults.
- [ ] Audit the canonical typing specification separately from PEP history and from the selected checker’s release notes.
- [ ] Pin the type checker, pytest, Hypothesis, and any OpenTelemetry lab package; confirm examples against those exact versions.
- [ ] Verify the live MIT 6.102 archive. If a semester URL moves, use the stable MIT 6.005 OCW archive while preserving the Python translation.
- [ ] Record commit hashes for every GitHub source-reading target; check that function/file names and reading budgets still fit.
- [ ] Record the Git version used for object/bisect exercises and consult that version’s command documentation.
- [ ] Recheck PyPA’s living specifications, especially `pyproject.toml`, dependency specifiers, core metadata, wheel, entry points, and lock-file adoption.
- [ ] Pin build frontend, backend, installer, packaging metadata, and commands; rebuild Atlas in a clean environment.
- [ ] Inspect the actual sdist/wheel contents and test installation into a fresh environment before publishing a lesson.
- [ ] Recheck PyPI Trusted Publishing guidance and minimize release-workflow permissions.
- [ ] Keep PostgreSQL lesson links on the exact supported major (`/docs/18/` in this audit), not `/current/`.
- [ ] Pin CMU/Berkeley semester pages or downloaded references; do not silently switch assignment expectations.
- [ ] Record SQLite foreign-key setting, journal mode, autocommit mode, timeout, compile options if relevant, and database path for every transaction lab.
- [ ] Regenerate query plans after data/statistics/version changes; do not grade against a plan string that the engine does not promise to keep stable.
- [ ] Run destructive/crash experiments only on disposable course data.
- [ ] Check every external link and every claim labeled “current” immediately before release.
- [ ] Re-audit licenses and attribution if any external text, image, code, exercise, or diagram—not merely a link—is incorporated.

## License, attribution, and reuse note

This source map links to external works and records what each contributes; it does not grant permission to republish them.

- Python software/documentation is covered by the [Python history and license page](https://docs.python.org/3/license.html); documentation code examples have additional Zero-Clause BSD terms described there.
- MIT OpenCourseWare states [CC BY-NC-SA 4.0 terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/). Attribute and observe noncommercial/share-alike requirements if OCW material is adapted, not merely linked. The live MIT 6.102 semester site should be treated separately unless its page states reuse terms.
- Pro Git’s repository records a [CC BY-NC-SA 3.0 license](https://github.com/progit/progit2/blob/main/LICENSE.asc).
- Google’s engineering-practices repository includes its [license](https://github.com/google/eng-practices/blob/master/LICENSE); retain attribution for adapted material.
- SQLite states that its deliverable code and documentation are [dedicated to the public domain](https://www.sqlite.org/copyright.html), subject to the qualifications on that page.
- Each PyPA, pytest, Hypothesis, OpenTelemetry, Git, PostgreSQL, BusTub, CMU, Berkeley, and Fowler resource must be checked under its own linked project/site terms before copying or adapting content.

Course-production rule:

> Link and synthesize by default. Write original explanations, diagrams, Atlas examples, quizzes, and projects. If a small external excerpt or code fragment is genuinely necessary, keep it bounded, attribute the exact source/version, preserve required notices, and record the applicable license. Never copy university assignment solutions or publish work that violates an academic-integrity policy.
