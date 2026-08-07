# Module 23 — Programming Languages, Interpreters, and Bounded Evaluation: Primary-Source Map

## Document status

- **Purpose:** primary-source, claim, safety, licensing, and teaching map for
  the Module 23 learner workbook, HTML visual studio, local reference model,
  quizzes, TA sessions, and Atlas checkpoint.
- **Course position:** Module 23 begins Arc V. It follows Module 22,
  *Security, Privacy, and Trust Boundaries*. Module 22 established that an
  external value is a claim/data until a receiving boundary has checked the
  relevant evidence and granted a scoped effect. Module 23 turns that rule
  into a concrete language-implementation discipline: **text has syntax and
  structure, but neither grants authority nor becomes Python code.**
- **Forward connection:** Module 24, *CPython, Performance, and Memory*, takes
  the trustworthy semantic model and looks underneath it: CPython code
  objects, frames, bytecode, specialization, allocation, profiling, and
  implementation-specific performance. Module 23 can inspect `ast` and `dis`
  output on trusted local examples, but it must not teach a particular
  bytecode sequence as portable language semantics.
- **Research snapshot:** **2026-07-30**. Python sources target public Python
  3.14.6 documentation unless an individual source states otherwise. Links
  were public on that date.
- **Evidence policy:** the Python Language Reference, Python 3.14 standard
  library documentation, current Python typing specification, accepted PEPs,
  and CPython source are authoritative for their named contracts. Official
  university course pages are used only for instructional ordering and
  assessment design—not as the authority for Python semantics or security
  guarantees.
- **Pedagogical bias:** learners predict a parser result, trace an AST,
  diagram an environment, and audit an evaluator/capability boundary before
  writing a small amount of code. They read a deliberately flawed patch and
  explain its authority escalation. They are not asked to construct exploits
  or a generic "sandbox."
- **Safety boundary:** the bounded evaluator and reference-model execution
  path use short inert strings, deterministic local fixtures, immutable
  records, and fake narrow capabilities. They perform no process, filesystem,
  shell, database, network, package, credential, browser, or remote-code
  operation, and never execute learner-supplied text as Python. A separate
  downloadable test harness reads its checked-in model source for a static
  prohibition check, and the optional fixed-scenario CLI writes bounded
  help/result text to standard output. Those are bounded local test/CLI I/O,
  not external effects; the CLI accepts no arbitrary query text.
- **Copyright policy:** explanations, diagrams, language grammars, fixtures,
  code, diagnostics, and assessments are original. Link and paraphrase
  external sources; do not copy substantial prose, diagrams, slides,
  assignments, reference implementations, or solution code.

This is an authoring boundary, not the learner-facing workbook. It defines
what Module 23 may claim, the evidence required for those claims, and the
limits it must label explicitly.

- **Delivery boundary:** this canonical map is a checked-in, hashable
  authoring input, not a configured Module 23 learner `/downloads` artifact.
  The current workbook exposes its local reference model, behavioral tests,
  and selected primary-source links; it does not provide this detailed map as
  a learner download. That packaging fact is not evidence of human review,
  contract approval, release, deployment, or learner mastery.

---

## Executive teaching decision

The learner arrives with a defensible Module 22 invariant: an externally
supplied trace field is not identity; a successful format check is not
authorization; and a component must not turn a supplied value into arbitrary
filesystem, process, database, network, or logging authority.

Module 23 gives that invariant a technical middle:

~~~text
received bytes/text [INPUT DATA]
    → bounded decode and length policy
    → tokens [LEXICAL STRUCTURE]
    → parse against an intentionally small grammar [SYNTAX ONLY]
    → typed/validated AST [PERMITTED LANGUAGE FORM]
    → semantic and authorization check [EXPLICIT DECISION]
    → bounded evaluator with a pre-minted narrow capability [LOCAL MODEL]
    → bounded, redacted result/evidence [LOCAL OBSERVATION]
    → M24: inspect trusted CPython compilation evidence, not a sandbox claim
~~~

The module has two deliberately connected languages:

1. **Pebble**, a pure expression language for first principles. It has
   literals, names, arithmetic/comparison/Boolean expressions, `if`, `let`,
   functions, and application. It teaches syntax versus semantics,
   environments, lexical scope, closures, evaluation order, value/error
   modelling, and contracts without mixing those ideas with authorization.
2. **Atlas Query**, a smaller, *non-general-purpose* query language over an
   immutable redacted fixture snapshot. Its source grammar deliberately lacks
   Python attribute access, imports, arbitrary function calls, mutation,
   loops, reflection, serialization, file paths, URLs, commands, and host
   names. A successful parse is still only a shaped request. It can read one
   fixed metric vocabulary only after an authenticated/authorized request has
   minted a fixed-scope `ReadLearningMetric` capability. The evaluator reads
   only its immutable fixture snapshot and does not issue real capabilities or
   perform external I/O. Its fixed CLI emits a closed packet to standard
   output, and its behavioral tests may read the checked-in source for a
   structural check.

The second language prevents a common pedagogical failure: teaching `eval`,
`exec`, `compile`, or a filtered `__builtins__` dictionary as a convenient
query engine. Python explicitly warns that `eval()` and `exec()` execute
arbitrary code, and says restricting `__builtins__` is not a security
mechanism. `ast.literal_eval()` deliberately does not execute arbitrary code,
but Python warns that relatively small input can still exhaust memory, C
stack, or CPU; it is not the module's untrusted-input solution.

### M22 → M23 → M24 connected sequence

| Boundary | Module 22 gives the learner | Module 23 makes precise | Module 24 continues |
|---|---|---|---|
| Supplied text | Syntax, schema, canonicalization, and limits are different checks; an input is not automatically trusted. | Grammar produces a parse result/AST, not permission or execution. Source spans make failures explainable. | The CPython parser/compiler pipeline and memory cost of real Python artifacts are implementation evidence. |
| Identity and authority | Authentication does not imply authorization; decisions include subject, action, resource, tenant, purpose, and policy. | An Atlas Query AST cannot choose a host callable or capability. A separately minted fixed-scope capability is required for the one read operation. | Frames, objects, imports, extension boundaries, and profiling show why ambient authority/performance claims must be measured. |
| Semantic meaning | "Validate" is not one generic box. | Distinguish lexical validity, grammar acceptance, AST-shape validation, name/schema resolution, contract/type check, authorization, and evaluation. | Distinguish language semantics from CPython implementation behavior and optimizations. |
| Failure/evidence | A timeout and trace ID are scoped observations; logs are minimized. | Evaluation returns a bounded tagged outcome with a source span/reason and redacted local evidence; it never invents an external outcome. | Observe trusted code objects/bytecode/profiling results with version labels. |
| Resource risk | A parser/library is not a complete security boundary. | Reject before parsing/evaluation on declared input, token, AST-depth/node, fuel, and result-size budgets. | Measure allocation, call-stack, bytecode, and runtime costs; retain platform/version caveats. |

### Required capstone invariant

> **An external Atlas-language text remains data after it tokenizes and after
> it parses. Only an explicitly versioned grammar, AST-shape and semantic
> contract, declared resource budgets, an authenticated and authorized
> request, and a pre-minted narrow capability may select one fixed evaluator
> operation. The evaluator has no ambient Python authority and cannot turn
> source text into imports, attribute access, arbitrary calls, file,
> process, database, network, or raw-log access. Its result is a bounded,
> redacted local model observation that says what it does and does not prove.**

This is an **Atlas teaching contract**. It is not a claim that a short Python
exercise is a complete security sandbox, production authorization service,
language formalization, compiler, operating-system isolation boundary, or
performance guarantee.

---

## Scope ownership and hard boundaries

### Module 23 owns

- the separation of concrete syntax, tokens, grammar, parse tree/AST,
  semantic checks, evaluation, values, errors, and effects;
- an approachable subset of grammar notation: terminal, non-terminal,
  sequence, choice, repetition, precedence, associativity, ambiguity, and
  source span;
- the distinction between a lexer/tokenizer and a parser, including Python's
  indentation tokens as a code-reading example;
- recursive AST data modelling and visitors, with the claim boundary that an
  AST is structure/data until a chosen consumer interprets it;
- environments, bindings, lexical scope, free variables, `global`,
  `nonlocal`, closures, and the contrast with dynamic-scope intuition;
- one explicit evaluation strategy for Pebble: deterministic left-to-right,
  call-by-value evaluation, plus short-circuit rules for the Boolean forms;
- small-step-style traces and big-step-style outcome equations as learner
  reasoning tools, not a demand for a full proof course;
- values/errors, syntactic well-formedness, dynamic checks, static contracts,
  type annotations, gradual typing, protocols, and the fact that annotations
  alone are not runtime validation, authorization, or proof;
- interpreter architecture: parse → validate → resolve/check → evaluate,
  never source → `eval`;
- a safe, resource-bounded Atlas Query evaluator that admits exactly an
  allow-listed query vocabulary and uses fake read-only fixtures;
- a modest, version-labelled code-reading bridge from trusted Python source
  to `ast.parse`, `compile`, code objects, and `dis` output;
- tests that distinguish syntax rejection, contract rejection, denied
  authority, exhausted fuel, unknown/unsupported form, and successful local
  result.

### Module 23 mentions but does not deeply implement

- parser generators, Pratt parsing, recursive descent, PEG/LL/LR tradeoffs,
  parser recovery, macro systems, gradual typing theory, type inference,
  effect systems, abstract interpretation, symbolic execution, verification,
  JIT compilation, and garbage collection;
- the CPython PEG grammar, CPython source tree, code object fields,
  specialization, bytecode cache, VM loop, native extensions, and alternate
  Python implementations as carefully labelled observational material;
- resource limits supplied by an OS/container/service boundary as examples
  of defence in depth; the reference model itself uses logical budgets only;
- audit hooks as a visibility mechanism. Python documentation says Python
  audit hooks are not suitable as a sandbox.

### Deferred or explicitly out of scope

- **Module 24:** CPython frames, compiler/VM internals, reference counting,
  cyclic GC, allocator/object layout, bytecode specialization, profiling,
  native/vectorized boundaries, and evidence-based performance work.
- **Later specialist study:** formal proofs of type safety, whole-language
  parsing theory, compiler construction, verified compilation, capability
  operating systems, container/VM hardening, adversarial sandbox research,
  malicious-code analysis, penetration testing, and production policy
  engines.
- **Never an exercise:** constructing code-execution bypasses, escaping a
  restricted evaluator, discovering unsafe `eval` payloads, or operating on
  a real endpoint, credential, file, process, database, or network target.

### Required non-claims

The workbook, visual studio, TA, reference model, and assessments must reject
all of the following statements:

- A string that parses is true, meaningful, authorized, safe to evaluate, or
  permitted to create an effect.
- A Python AST is a semantic proof, a security policy, or an executable-safe
  representation by itself.
- `ast.parse()` means the source can compile/run; Python notes that parsing
  does not perform all scoping checks and compilation can still fail.
- `ast.literal_eval()` is a general solution for untrusted input or resource
  denial-of-service risk.
- Removing/replacing `__builtins__`, limiting globals/locals, using `eval`
  only for expressions, or adding an audit hook creates a general Python
  sandbox.
- A type annotation, `Protocol`, `NewType`, type guard, or clean static type
  checker result validates external data at runtime, authorizes a request, or
  proves a security property.
- One runtime `isinstance` check proves a domain invariant such as tenant,
  freshness, ownership, schema version, or resource budget.
- A capability-shaped Python object is automatically least privilege; its
  creator, scope, delegation, lifetime, revocation, and host boundary still
  matter.
- A fuel counter prevents all CPU/memory/stack/denial-of-service problems or
  substitutes for process/container/OS limits.
- `dis` output is the Python language specification, stable across releases,
  portable across Python VMs, or a performance result without measurement.
- A local model result proves a remote read/effect occurred or an external
  policy/service is secure.

---

## First-principles model: representation, meaning, authority, and cost

### Four questions at every arrow

Every session asks the learner to label an arrow in an implementation diagram:

1. **What representation is crossing?** Raw text, token, AST node, name,
   value, error, capability, or evidence record.
2. **What meaning has actually been established?** Character encoding only,
   lexical shape, grammar membership, domain meaning, type/contract result,
   or evaluation result.
3. **What authority, if any, crossed?** None by default. If an operation
   needs one, name the subject, action, resource, tenant, purpose, scope,
   lifetime, and policy decision that minted it.
4. **What resource/correctness promise has been checked?** Input length,
   token count, node count/depth, evaluation fuel, output size, deterministic
   order, error span, or a known unknown.

### Evidence labels for diagrams and code review

| Label | Meaning | Example |
|---|---|---|
| `[INPUT DATA]` | Received representation; no language meaning or authority is implied. | A query string in an HTTP body. |
| `[LEXICAL STRUCTURE]` | A bounded scan recognized tokens. | `METRIC`, `IDENTIFIER`, `>=`, integer token. |
| `[SYNTAX ONLY]` | The grammar accepted an arrangement of tokens. | A query AST has a `Where` clause. |
| `[PERMITTED LANGUAGE FORM]` | AST node/tag/schema/version is in Atlas Query's small allow-list. | `Count` over a fixed aggregate vocabulary. |
| `[CONTRACT CHECKED]` | Domain names/types/cardinality/semantic rule passed. | Metric exists and operator matches its declared type. |
| `[AUTHORIZED]` | Module 22 policy permitted a named subject/action/resource/tenant/purpose. | `READ_LEARNING_METRIC` for this cohort. |
| `[NARROW CAPABILITY]` | A fixed, non-user-selectable adapter is supplied to evaluator code. | Read-only fixture lookup for one cohort/metric family. |
| `[LOCAL MODEL]` | Deterministic course fixture behavior. | Evaluator returns `Result(value=3)`. |
| `[LOCAL OBSERVATION]` | The current model saw a decision/outcome. | `FUEL_EXHAUSTED` at AST node 12. |
| `[UNKNOWN]` | Evidence does not settle the fact. | Whether a real remote analytics service would return the same value. |

### The two-language teaching architecture

~~~text
Pebble (pure, explanatory)                     Atlas Query (bounded, policy-aware)
--------------------------------              --------------------------------------
text → tokens → AST                           text → bounded scan → AST
                 ↓                                           ↓
          environment / closures                      schema + AST contract
                 ↓                                           ↓
          deterministic evaluator                 M22 authorization decision
                 ↓                                           ↓
       value | language error                    fixed-scope read capability
                                                          ↓
                                                 bounded evaluator → redacted result
~~~

Pebble deliberately has **no** host effects. Atlas Query deliberately has no
user-controlled function values, names that resolve to host objects, or
general calls. A learner therefore sees why closure semantics and capability
design are related without claiming that a Python closure or a dict of
globals is a security boundary.

### Suggested original tiny grammars

The course author may refine names, but the grammar must stay smaller than
the concepts being taught and every production must have tests and a semantic
meaning.

~~~text
# Pebble: syntax used for environments, closures, and evaluation only
expr    ::= INT | BOOL | NAME
          | "(" expr OP expr ")"
          | "if" expr "then" expr "else" expr
          | "let" NAME "=" expr "in" expr
          | "fun" NAME "=>" expr
          | "(" expr expr ")"

# Atlas Query: data-query grammar, not host-language source
query   ::= "count" "(" filter ")"
          | "mean" "(" METRIC "," filter ")"
filter  ::= "where" FIELD CMP LITERAL
          | "where" FIELD CMP LITERAL "and" FIELD CMP LITERAL
FIELD   ::= fixed schema field names only
METRIC  ::= fixed metric names only
CMP     ::= "=" | ">=" | "<="
~~~

The reference implementation should parse its own grammar rather than call
Python `eval`, `exec`, `compile`, or `ast.literal_eval` on external text. The
tiny grammar is an original course artifact, not a subset that claims to
faithfully accept Python grammar.

---

## Required visual-studio views

The learner-facing HTML must use original diagrams, keyboard-reachable native
controls, visible focus, high contrast, text labels in addition to colour,
reduced-motion support, semantic headings, and a text-equivalent description
for each visual. No external data, analytics, code runner, or untrusted text
execution is permitted. The studio should use prediction → confidence →
reveal → explanation, not a passive slide deck.

1. **Text-to-tree boundary atlas** — A bounded source string moves through
   character/decode, token, grammar, AST, contract, decision, capability, and
   result cards. Learner prediction: “Does a successful parse authorize the
   query?” Correct response: no; parsing establishes only syntax.
2. **Lexer, grammar, and precedence workbench** — Show a short original
   Pebble expression as characters, tokens, grammar productions, and AST.
   Learner chooses which tree reflects precedence/associativity; invalid
   token, invalid grammar, and valid-but-disallowed form have distinct text
   outcomes. Include a compact Python `INDENT`/`DEDENT` observation card
   labelled as Python-specific code-reading evidence.
3. **Environment and closure theatre** — Steppable stack/frame diagram for
   `let`, function creation, application, name lookup, `global`, and
   `nonlocal` examples. It must show a function value carrying a lexical
   environment and explicitly contrast this with "look up in the caller".
   Learner predicts the binding before reveal.
4. **Evaluation-semantics trace** — A left-to-right call-by-value reduction
   trace with source-span tags, values, and error propagation. A toggle
   compares eager evaluation, `if` branch selection, and short-circuit
   Boolean evaluation. It explains that evaluation order is a named language
   choice—not a property that falls out of an AST.
5. **Contract and capability checkpoint** — A layered card stack separates
   syntax, AST allow-list, schema/name resolution, type/domain contract,
   resource budget, M22 authorization, and fixed capability. Learner must
   decide the earliest layer that rejects each local fixture. The capability
   cannot be named or selected by query text.
6. **Trusted-source compilation bridge** — For a fixed, bundled Python
   snippet only, align source → `ast` summary → code-object idea → a `dis`
   observation. The downloadable bridge parses the fixed text, then inspects
   a separately defined matching function's existing code object; it does not
   compile the displayed source at bridge time. The static studio card is an
   illustrative, not a captured, disassembly; an actual observation must name
   its local Python implementation and version (and say CPython only when
   that is the recorded implementation). A final card says bytecode is not
   portable language semantics. No custom input, arbitrary Python evaluator,
   or runnable code box exists in this view.

### Accessibility/reading requirements

- Give diagrams a prose traversal order and include source-span examples in
  text, not hover alone.
- Use tables only where row/column comparison is essential; reflow or stack
  them at narrow widths.
- Do not use a colour such as red/green as the only error/success signal;
  combine an icon, label, and short reason.
- Put the security distinction into every tab's plain text: **structure is
  data; authority is separate and explicit.**
- Persist only local view/reveal state if progress persistence is used. Never
  persist query strings, fixture records, identity, policy, token stream, or
  capability-like data.

---

## Six-session teaching sequence and reading route

Each session includes a 7-minute prediction diagnostic, a code/diagram
reading block, a compact implementation/review block, and a one-minute
retrieval prompt. Sessions use the same Atlas scenario: a user asks for an
analytics summary after Module 22's delayed-import incident. The request must
not become host-language authority merely because it looks syntactically
valid.

| Session | First-principles question | Teaching and code-reading work | Atlas artifact / connection |
|---|---|---|---|
| 1. **Text has form, not permission** | What different facts are established by decoding, tokenizing, and parsing? | Derive a tiny grammar, trace Python lexical `INDENT`/`DEDENT` as a separate example, contrast syntax error with semantic rejection, inspect an `ast.parse` dump on a trusted snippet. | A boundary table that labels every stage `[INPUT DATA]` through `[SYNTAX ONLY]`; rejects `parse ⇒ authorized`. |
| 2. **A tree gets meaning from rules** | How can the same tree have no result until an evaluator defines it? | Read a recursive evaluator for literals, binary operations, `if`, and language errors. State deterministic left-to-right/call-by-value rules and predict traces. | A Pebble AST/value/error contract and an evaluation trace with source spans. |
| 3. **Names live in environments; functions close over them** | Why does a function not normally look up a free name in its caller? | Draw nested environments; run a hand trace for `let`, function creation/application, shadowing, closure capture; compare to Python naming/binding, `global`, `nonlocal`, and dynamic runtime lookup. | A lexical-scope explanation and counterexample to a caller-environment implementation. |
| 4. **Contracts make invalid states visible** | What do syntax, domain checks, dynamic validation, and static types each establish? | Inspect AST variants; define tagged values and narrow AST types; discuss `typing`/`Protocol`/`NewType` as static communication, then write explicit runtime schema/domain validators. | A check matrix that identifies the first failing layer and says why a type hint is not authorization. |
| 5. **Bounded evaluation receives authority, never finds it** | Which capability is required, who minted it, and what does the evaluator remain unable to do? | Review a flawed source→`eval` patch; replace it with bounded token/parser/AST/schema/fuel/capability layers. Trace a valid query, unknown metric, denied request, and fuel exhaustion. | An Atlas Query decision record: action/resource/tenant/purpose, fixed capability scope, input/AST/fuel limits, redacted result. |
| 6. **Implementation evidence is not semantic law** | What can a trusted `ast`/`dis` observation teach without becoming a portability/security claim? | Compare a Pebble trace with trusted Python AST and CPython `dis` excerpts; inspect `compile` modes and code-object idea; classify claims as language spec, CPython detail, Atlas model, or unknown. | Capstone review + a M24 handoff question: what must be benchmarked or inspected rather than inferred? |

### Reading route

1. **Before Session 1:** Python [lexical analysis](https://docs.python.org/3.14/reference/lexical_analysis.html), [full grammar](https://docs.python.org/3.14/reference/grammar.html), and [`tokenize`](https://docs.python.org/3.14/library/tokenize.html). Read only the selected fragments shown in the workbook; the full grammar is reference material, not an assignment to memorize.
2. **Before Sessions 2–3:** Python [execution model](https://docs.python.org/3.14/reference/executionmodel.html) and [expressions](https://docs.python.org/3.14/reference/expressions.html), then the course's original Pebble evaluator.
3. **Before Session 4:** Python [`typing`](https://docs.python.org/3.14/library/typing.html) opening note and [Python type-system specification](https://typing.python.org/en/latest/spec/type-system.html) purpose/non-goals.
4. **Before Session 5:** Python [`eval`/`exec`/`compile`](https://docs.python.org/3.14/library/functions.html), [`ast`](https://docs.python.org/3.14/library/ast.html) warnings, [`resource`](https://docs.python.org/3.14/library/resource.html), and [`sys.addaudithook`](https://docs.python.org/3.14/library/sys.html#sys.addaudithook) warning.
5. **Before Session 6:** Python [`dis`](https://docs.python.org/3.14/library/dis.html) opening caveat and one labelled CPython source/code-reading card.

---

## Primary-source ledger

### Python language and standard-library contracts

| Source | Authoritative use in Module 23 | Explicit authoring limit |
|---|---|---|
| Python 3.14 [Lexical analysis](https://docs.python.org/3.14/reference/lexical_analysis.html) | Tokens, logical lines, names, literals, and `INDENT`/`DEDENT` behavior for Python-reading examples. | Do not claim Pebble/Atlas Query uses all Python lexical rules. |
| Python 3.14 [Full grammar specification](https://docs.python.org/3.14/reference/grammar.html) | Python grammar is derived directly from the grammar used to generate the CPython parser; notation/PEG reference. | It omits code-generation/error-recovery details; it is not a portable parser API or an invitation to implement all Python. |
| [PEP 617 — New PEG parser for CPython](https://peps.python.org/pep-0617/) | CPython's PEG parser rationale, grammar notation background, and the implementation-specific parser bridge. | Applies to CPython parser work; not an operational semantics or a security policy. |
| Python 3.14 [Execution model](https://docs.python.org/3.14/reference/executionmodel.html) | Code blocks, execution frames, name binding, nested environments, free variables, `global`, `nonlocal`, dynamic feature caveats, and runtime/implementation labelling. | Explain selected Python semantics; do not infer a complete model of every Python implementation or host isolation. |
| Python 3.14 [`symtable`](https://docs.python.org/3.14/library/symtable.html) | Compiler symbol tables are generated from an AST before bytecode generation and expose scope facts for trusted-source exploration. | Read-only implementation evidence; do not make the bounded language reproduce all Python scope analysis. |
| Python 3.14 [Expressions](https://docs.python.org/3.14/reference/expressions.html) | Meaning of selected expression forms; names/literals are not simply source strings. | Use it to contrast syntax/semantics, not to teach all Python expression forms. |
| Python 3.14 [`tokenize`](https://docs.python.org/3.14/library/tokenize.html) | A lexical scanner returns token/location information; documentation warns its functions are designed for syntactically valid Python code. | Do not use it as a general invalid-input validator or as the Atlas Query lexer. |
| Python 3.14 [`ast`](https://docs.python.org/3.14/library/ast.html) | `ast.parse` produces ASTs; AST node inspection/visitors; parser-versus-compilation/scoping distinction; `literal_eval` resource warning. | Only trusted short snippets go through Python AST demos. Never label `ast.literal_eval` safe for untrusted data. |
| Python 3.14 [built-ins: `compile`, `eval`, `exec`](https://docs.python.org/3.14/library/functions.html) | `compile` modes and the fact code objects can be passed to `eval`/`exec`; explicit arbitrary-code warning; builtins restriction is not a security mechanism. | Do not expose external text to these APIs in the reference model/studio. |
| Python 3.14 [`dis`](https://docs.python.org/3.14/library/dis.html) | CPython bytecode analysis, compiler/interpreter connection, inline cache/specialization observation, and explicit instability caveat. | Labels must say CPython/version-specific; no stable opcode, VM, or performance promise. |
| Python 3.14 [`typing`](https://docs.python.org/3.14/library/typing.html) | Python runtime does not enforce variable/function annotations; type aliases, `NewType`, callable/protocol examples. | Do not treat annotations or static analysis as runtime contracts/authorization. |
| Python 3.14 [annotations](https://docs.python.org/3.14/reference/compound_stmts.html#annotations), [PEP 649](https://peps.python.org/pep-0649/), [PEP 749](https://peps.python.org/pep-0749/), and [`annotationlib`](https://docs.python.org/3.14/library/annotationlib.html) | In Python 3.14 annotations are lazy by default; introspection/evaluation is an execution-adjacent boundary and can run arbitrary expressions depending on mechanism/format. | Treat untrusted annotations as untrusted text/objects; do not inspect/evaluate them in the reference model. |
| [Python type-system specification](https://typing.python.org/en/latest/spec/type-system.html) | Static analysis is the primary goal; Python remains dynamically typed; runtime checking requires additional machinery. | It specifies typing semantics, not the Atlas Query language or business policy. |
| [PEP 484 — Type Hints](https://peps.python.org/pep-0484/) | Historical/core type-hint terminology and context. | Refer to the current typing specification for canonical current type-system rules. |
| [PEP 544 — Protocols](https://peps.python.org/pep-0544/) and [PEP 647 — User-Defined Type Guards](https://peps.python.org/pep-0647/) | Structural typing and static narrowing concepts used to explain contracts. | Neither makes an external runtime claim true or grants capability. |
| Python 3.14 [`resource`](https://docs.python.org/3.14/library/resource.html) | OS-level resource measurement/limits exist, but availability/resources are system-dependent. | Do not make Unix-only `resource` calls a portable model requirement or claim logical fuel equals OS containment. |
| Python 3.14 [`sys.addaudithook`](https://docs.python.org/3.14/library/sys.html#sys.addaudithook) and [PEP 578](https://peps.python.org/pep-0578/) | Audit hooks are visibility/monitoring tools; Python docs and PEP explicitly reject treating them as a general sandbox. | Do not build an audit-hook-based evaluator or rely on hooks as an enforcement boundary. |
| [CPython grammar source, v3.14.6](https://github.com/python/cpython/blob/v3.14.6/Grammar/python.gram), [compiler entry point, v3.14.6](https://github.com/python/cpython/blob/v3.14.6/Python/bltinmodule.c), and [CPython `dis` docs source, v3.14.6](https://github.com/python/cpython/blob/v3.14.6/Doc/library/dis.rst) | Optional trusted code-reading bridge: grammar source and `compile` path show why actual implementation detail must be version-labelled. | Do not require learners to infer behavior from a moving branch; these links are pinned to the documented 3.14.6 snapshot, and any copied excerpt still needs a file-specific notice review. |

### University material: pedagogy and sequence only

| Official university source | Legitimate pedagogical takeaway | Not used as authority for |
|---|---|---|
| Brown [CSCI 1730 Interpreter assignment](https://cs.brown.edu/courses/csci1730/2024/interpreter.html) | A small grammar/AST, explicit evaluation order, interpreter tests, and debugging provide a coherent sequence. | Python language semantics, security claims, or copying its assignment/text. |
| Brown [CS 1730 course framing](https://cs.brown.edu/courses/cs173/2012/) | An engineering approach can teach language semantics through construction and validation. | The source language’s exact behavior; course material remains copyrighted. |
| Cornell [CS 3110 Interpreters](https://courses.cs.cornell.edu/cs3110/2021sp/textbook/interp/intro.html) | Contrast interpreter, compiler, bytecode VM, and JIT in a conceptual progression. | CPython implementation details or performance conclusions. |
| Cornell [CS 4110 schedule](https://www.cs.cornell.edu/courses/cs4110/2012fa/schedule.php) | Semantics → interpreters → type/security topics is a useful sequence for a deeper course. | A required textbook/syllabus or current university policy. |
| UC Berkeley [CS 61A Scheme specification](https://site.cs61a.org/articles/scheme-spec/) | Expressions/environments and a parent-frame model support visual, trace-based interpreter teaching. | Scheme or Python semantics beyond its stated course implementation. |

---

## Claim-to-source matrix for authoring and TA use

| ID | Claim the learner may be taught | Source/evidence | Label/guardrail |
|---|---|---|---|
| L1 | Python lexical analysis uses indentation to determine statement grouping and generates `INDENT`/`DEDENT` tokens with a stack discipline. | Python [lexical analysis](https://docs.python.org/3.14/reference/lexical_analysis.html#indentation). | **Python-specific** code-reading fact; not Pebble grammar. |
| L2 | The Python 3.14 full grammar is derived from the grammar used to generate the CPython parser and uses PEG-specific notation. | Python [full grammar](https://docs.python.org/3.14/reference/grammar.html), [PEP 617](https://peps.python.org/pep-0617/). | **CPython grammar representation**; do not promise source compatibility/parser completeness. |
| L3 | Tokens and parse trees/ASTs are representations. An evaluator (or another consumer) gives an AST operational meaning. | Original course model, illustrated against Python [`ast`](https://docs.python.org/3.14/library/ast.html) and execution-model sources. | **Atlas/Pebble model**; not a claim that all language tooling has one architecture. |
| L4 | `ast.parse` parses source to an AST but successful parsing does not prove it can compile/run; scoping checks occur in compilation. | Python [`ast`](https://docs.python.org/3.14/library/ast.html#ast.parse). | Use fixed short trusted samples only. |
| L5 | Python name binding scans a block for binding operations; names resolve through nearest enclosing scopes, and `nonlocal` refers to an enclosing function binding. | Python [execution model](https://docs.python.org/3.14/reference/executionmodel.html). | Teach lexical scope with a labelled Python contrast; closures are modeled in Pebble. |
| L6 | Free-variable lookup happens at runtime; `eval`/`exec` have special environment behavior and do not resolve free variables in the nearest enclosing namespace in the usual way. | Python [execution model](https://docs.python.org/3.14/reference/executionmodel.html#interaction-with-dynamic-features). | This defeats a simplistic globals/locals "safe evaluator" story. |
| L6a | A CPython symbol table offers useful evidence about scope before bytecode generation, but it is an implementation/inspection aid rather than the complete semantic definition of Python or Pebble. | Python [`symtable`](https://docs.python.org/3.14/library/symtable.html). | **Trusted Python observation**; do not expose user source to the studio/model. |
| L7 | `compile` creates code/AST objects, while `eval` and `exec` can execute arbitrary code. `eval` with altered `__builtins__` is not a security mechanism. | Python [built-ins](https://docs.python.org/3.14/library/functions.html#eval). | **Prohibition:** no external source reaches these functions. |
| L8 | `ast.literal_eval` avoids arbitrary Python code execution but can consume excessive memory/CPU or C stack; Python does not recommend it for untrusted data. | Python [`ast.literal_eval`](https://docs.python.org/3.14/library/ast.html#ast.literal_eval). | **Prohibition:** not the Atlas boundary; limits must precede our own parsing. |
| L9 | Python type annotations are not runtime-enforced; type system aims primarily at static analysis and Python remains dynamically typed. | Python [`typing`](https://docs.python.org/3.14/library/typing.html), [type-system specification](https://typing.python.org/en/latest/spec/type-system.html). | Separate static communication from runtime contracts/policy. |
| L9a | Annotation introspection can itself be an evaluation boundary in modern Python; annotations are not automatically inert comments. | Python [annotations reference](https://docs.python.org/3.14/reference/compound_stmts.html#annotations), [PEP 649](https://peps.python.org/pep-0649/), [PEP 749](https://peps.python.org/pep-0749/), and [`annotationlib`](https://docs.python.org/3.14/library/annotationlib.html). | Do not introspect/evaluate untrusted annotations in the reference model. |
| L10 | Bytecode observed through `dis` is explicitly an implementation detail that can change across versions and implementations. | Python [`dis`](https://docs.python.org/3.14/library/dis.html). | **Local implementation/version-specific observation**; say CPython only when the recorded runtime is CPython, and make no bytecode-as-semantics claim. |
| L11 | OS resource limits are available through `resource` on Unix, are system-dependent, and differ from in-language logical budgets. | Python [`resource`](https://docs.python.org/3.14/library/resource.html). | Model fuel/depth/size independently; defer host enforcement to systems design. |
| L12 | Python audit hooks support observation and may be bypassed/disabled by malicious code; documentation says they are not suitable as a sandbox. | Python [`sys.addaudithook`](https://docs.python.org/3.14/library/sys.html#sys.addaudithook), [PEP 578](https://peps.python.org/pep-0578/). | **Prohibition:** no audit-hook sandbox claim. |
| L13 | An authenticator/policy decision from M22 must still be scoped to subject/action/resource/tenant/purpose; grammar acceptance adds no such fact. | Module 22 course invariant plus this module’s original evaluator contract. | **Atlas teaching contract**; use fake policy fixture only. |
| L14 | A fuel counter, AST depth cap, token cap, input cap, and output cap make the model’s *declared* work bounded and testable. | Original Atlas model informed by Python AST/resource warnings. | It is not a whole-process memory/time/side-channel proof. |
| L15 | A capability passed by trusted host code can be made smaller than ambient globals, but true security also depends on capability construction, object escape, host/runtime isolation, and policy. | Original Atlas design, bounded by M22 and Python sandbox non-claims. | Make scope/lifetime/owner visible; no production-sandbox claim. |

---

## Defensive Atlas scenario and test matrix

### Fixed scenario

After the Module 21 timeout and Module 22 hardening review, an authorized
analyst requests a small aggregate over redacted local learning events. A
generated patch proposes:

~~~python
# Deliberately flawed reading-only patch — never execute learner input here.
return eval(request.query_text, {"__builtins__": {}}, record_context)
~~~

Learners do **not** generate bypasses. They identify the broken contract:

- request text has become Python source rather than a small language;
- `record_context` can become a name-resolution surface;
- a purportedly empty builtins dictionary is not a security mechanism;
- resource use, AST shape, semantic meaning, and effects are unspecified;
- neither parser success nor caller identity yields the scoped query authority;
- output/evidence may reveal data beyond the permitted scope.

The repaired Atlas path is deliberately boring and auditable:

~~~text
fixed local request fixture
    → bounded UTF-8/string length check
    → original Atlas Query lexer/parser
    → versioned AST allow-list and source-span check
    → fixed schema/type/domain checks
    → M22 model authorization decision
    → pre-minted ReadLearningMetric(scope, metric-vocabulary) capability
    → node/depth/fuel/output-bounded evaluator
    → redacted local evidence packet
~~~

### Required reference-model seams

The executable query evaluator should be standard-library-light and
deterministic. It uses immutable in-memory fixtures and has no external I/O or
side effects. This constraint does not describe the surrounding CLI/test
harness: the fixed CLI writes a closed evidence packet to standard output, and
a structural test reads the checked-in model source. A suitable public
evaluator contract contains the following pure seams (names may differ):

| Seam | Input | Output | Non-negotiable invariant |
|---|---|---|---|
| `check_input_budget` | text/bytes metadata + fixed policy | tagged accept/reject | Reject length/encoding limits before lexer/parser work. |
| `lex_query` | bounded text | tokens with spans or `LEX_ERROR` | No Python tokenizer/evaluator; unknown characters have a span/reason. |
| `parse_query` | token list | original tagged AST or `PARSE_ERROR` | AST contains only original frozen node types; no host object/callable. |
| `validate_query` | AST + versioned schema | permitted plan or `CONTRACT_ERROR` | Syntax does not imply known metric/field/type/cardinality. |
| `authorize_query` | fixed request context + requested read scope | decision | Preserve M22 subject/action/resource/tenant/purpose/policy semantics. |
| `mint_read_capability` | permitted fixed decision | opaque narrow immutable model object | Query text cannot choose adapter/function/scope; denied decision yields no capability. |
| `evaluate_query` | permitted plan + fixed capability + limits | `RESULT`, `FUEL_EXHAUSTED`, or domain error | No ambient imports, Python dynamic execution, reflection, filesystem/process/network/db, mutation, or raw logging. |
| `redact_evidence` | closed tagged outcomes | closed record | Include policy/grammar/model/limit labels, not raw source/query/records/capability internals. |

### Required behavioural tests

The eventual model/tests should contain a compact but broad matrix such as:

| Category | Fixture assertion | Why it matters |
|---|---|---|
| Input boundary | Empty, malformed encoding representation, oversized text, and overlong token candidate reject before parse/evaluate. | A resource contract starts before AST construction. |
| Lexer/parser | Valid original query produces the expected frozen AST; missing delimiter, unknown token, trailing token, and unbalanced form have stable tagged reason/span. | Separate lexical/syntax failure from permission. |
| AST contract | A manually constructed foreign/unknown node or forbidden operation is rejected before evaluation. | Do not trust an AST merely because it is an object of a convenient host type. |
| Schema/type/domain | Unknown metric, wrong literal type, invalid comparator, duplicate/unsupported filter shape, and impossible aggregation reject as contract errors. | Grammar membership is not domain meaning. |
| Pebble semantics | Shadowing, closure capture after outer function returns, `nonlocal` contrast, left-to-right evaluation, `if` branch laziness, and short-circuit behavior have explicit expected outcomes. | Tests semantics rather than line coverage. |
| Authorization | An authenticated but wrong-tenant/wrong-purpose/wrong-action request is denied; no capability is minted. | Carry M22’s decision tuple forward. |
| Capability | A permitted request sees only its fixed scope/vocabulary; unsupported operation cannot choose a function/adapter through query text. | The evaluator receives narrow authority rather than discovering ambient authority. |
| Resource bounds | Token count, AST node/depth, recursion/fuel, aggregate cardinality, and result rendering cap each produce distinct deterministic tagged outcomes. | Avoid a single opaque "safe" claim. |
| Evidence | Every scenario emits a closed, redacted, version-labelled local evidence record without raw query/record/capability data. | Preserve privacy and epistemic limits. |
| Static structural check | The test harness reads the checked-in model source and rejects `eval(`, `exec(`, `compile(`, `ast.literal_eval`, `pickle`, `marshal`, `subprocess`, filesystem, socket/HTTP/database, import execution, or user-callable adapter paths. | Fails closed against regression in the teaching model; not evidence about arbitrary production code. |
| Compilation bridge | Fixed trusted text produces an AST observation, while a separately defined matching function supplies the code-object/`dis` observation; the bridge does not compile the displayed source at bridge time. Any actual instruction list names the local Python implementation/version; tests do not assert exact opcode sequences across versions. | Reinforce language-spec versus implementation evidence. |

### Completion criteria for the Atlas checkpoint

The checkpoint is complete only when a learner can:

1. draw the input→token→AST→contract→decision→capability→result chain and
   state what evidence each arrow establishes;
2. explain a syntax rejection, contract rejection, authorization denial,
   fuel exhaustion, and a local successful result without collapsing them into
   "invalid query";
3. trace a Pebble closure using a lexical environment and explain why a
   caller-environment lookup changes language meaning;
4. review source and locate why a source→`eval` proposal violates the
   invariant without attempting to bypass it;
5. distinguish Python language-reference facts, CPython/version-specific
   observations, Atlas model fixtures, and unknown real-world outcomes;
6. pass a small confidence-aware MCQ diagnostic and defend one architectural
   tradeoff verbally or in a short annotated diagram;
7. contribute an original test that would distinguish a plausible broken
   parser/evaluator/capability implementation from the intended contract.

---

## Assessment doctrine, diagnostics, and TA approach

### What to assess

Assess understanding of boundaries and semantics, not speed at writing a
parser. Each diagnostic question should have one best answer, a confidence
rating (1–4), an immediate explanation, and a short "what evidence would
change your mind?" follow-up.

| Concept | Good assessment evidence | Weak substitute to avoid |
|---|---|---|
| Grammar vs meaning | Learner labels parse success as syntax only and identifies missing schema/authorization facts. | Asking them to recite grammar definitions. |
| Lexical scope | Learner draws environment parent links and predicts closure result. | Asking them to remember an acronym without a trace. |
| Evaluation semantics | Learner traces only evaluated branches and identifies evaluation order. | Asking a large handwritten interpreter implementation. |
| Contracts/types | Learner says what a type hint can communicate and what explicit runtime/domain check remains. | Equating type annotations with input validation. |
| Capability boundary | Learner names the one capability, its scope, and why source text cannot choose it. | Claiming `{}` globals forms a sandbox. |
| Resource bounds | Learner chooses the earliest relevant bound and names a remaining host-level risk. | Treating a fuel count as universal DoS protection. |
| CPython bridge | Learner labels `dis` result CPython/version-specific and proposes a M24 measurement. | Memorizing opcodes. |

### Eight confidence-aware multiple-choice prompts

Use original wording/fixtures. Answers below are author guidance, not learner
handout prose.

1. **A string parses as an Atlas Query. What has been established?**
   Best: it matches the declared grammar/AST shape; schema, authority, and
   resource/effect permission require later evidence.
2. **Why is `ast.parse(text)` not a safe query evaluator?**
   Best: it produces a Python AST and can still have resource/scoping/compile
   caveats; it does not define the permitted Atlas language or authorization.
3. **A closure returns a free variable after its creating function returns.
   Which environment should the language model use?**
   Best: the lexical environment captured at function creation, for Pebble’s
   stated semantics.
4. **Which check belongs earliest for an unknown character?**
   Best: lexical boundary, before AST/type/authorization/evaluation.
5. **What does a clean static type-checker result establish?**
   Best: evidence about the checker’s static model; it does not validate a
   received runtime value or authorize a request.
6. **What does a permitted Module 22 decision add after a valid query AST?**
   Best: a scoped decision about subject/action/resource/tenant/purpose; it
   still should mint only a narrow fixed capability.
7. **What is the correct reading of `FUEL_EXHAUSTED` in the local model?**
   Best: the declared model budget stopped evaluation; it does not prove a
   real service was safe or a remote operation did/did not happen.
8. **What can `dis` teach here?**
   Best: a version-labelled observation of CPython bytecode, useful for M24
   questions but not a stable language-semantic or sandbox guarantee.

### TA and study-partner protocol

The TA and Study Partner should maintain different jobs.

| Moment | Instructor | TA | Study Partner |
|---|---|---|---|
| Before a session | Set the one first-principles question and source card. | Ask for prediction/confidence; identify whether the gap is grammar, environment, contract, authority, or cost. | Rephrase the learner’s prediction and request a one-arrow diagram. |
| During code reading | Reveal a small relevant slice after prediction. | Use “what fact changed at this line?” and “what could this function still not do?” | Trace values/environments aloud and challenge unsupported leaps. |
| After a wrong answer | Explain the distinction, not only the answer. | Give a one-fixture counterexample and a 90-second repair prompt. | Ask learner to teach the corrected boundary back in plain language. |
| At capstone review | Evaluate evidence labels and tradeoffs. | Audit tests: can one test distinguish parse, contract, denial, and fuel failures? | Role-play reviewer: ask where authority first appears and what remains unknown. |

TA escalation clues:

- If learner says “it parsed, so it is valid,” return to the six evidence
  labels and ask whether a nonexistent metric parses.
- If learner uses caller lookup for a closure, draw two frames and change the
  caller’s binding; ask whether function meaning should vary with caller.
- If learner says type hints validate input, compare an annotation with a
  received `str` and ask where an exception/decision actually occurs.
- If learner says an empty `__builtins__` map is sufficient, use the Python
  documentation warning; do not demonstrate escapes.
- If learner says fuel solves denial of service, distinguish the local
  evaluator’s semantic budget from host memory/stack/OS constraints.
- If learner reads an opcode as a language rule, ask which source (Python
  reference or CPython `dis` caveat) owns that claim.

---

## Authoring, source, and licensing ledger

### Citation/use policy

| Material | Allowed course use | Attribution/license guidance |
|---|---|---|
| Python docs and typing spec | Link, paraphrase short claims, cite near the relevant card, and write original examples/diagrams. | Python documentation pages state PSF License Version 2; code examples have an additional Zero-Clause BSD license. Keep attribution and do not bulk-copy pages. |
| PEPs | Link and paraphrase relevant rationale/standard wording; quote only short necessary fragments. | Check each PEP’s copyright/license section; retain attribution, do not reproduce a PEP as course text. |
| CPython source | Use only small pinned, explanatory excerpts if necessary; prefer public docs/`dis` output. | CPython is under the PSF License; link to exact revision/version and preserve notices when copying permitted excerpts. |
| University course pages/assignments | Link as pedagogy inspiration only; write fresh sessions, fixtures, diagrams, tests, and prompts. | Treat as copyrighted course material; do not reproduce assignments, slides, solutions, reference code, or grading content. |
| Atlas workbooks/studio/model | Original artifact. | Keep source map links and label simulation/model limits. |

### Final authoring checklist

- [ ] Workbook begins from Module 22’s authority boundary rather than a
  disconnected grammar survey.
- [ ] Every new term is located in the same pipeline: text, tokens, AST,
  contracts, environment/evaluation, authority, bounds, evidence.
- [ ] Pebble teaches closures/evaluation with no effects; Atlas Query teaches
  narrow authority with no arbitrary host execution.
- [ ] No learner-facing artifact contains user-configurable `eval`, `exec`,
  `compile`, `ast.literal_eval`, code runner, raw request data, or exploit
  construction.
- [ ] Every chart distinguishes `[SYNTAX ONLY]`, `[CONTRACT CHECKED]`,
  `[AUTHORIZED]`, and `[LOCAL MODEL]`.
- [ ] Model/test source makes structural prohibitions and bounded-result
  contract executable.
- [ ] Type-hint material clearly says static analysis is primary and runtime
  checks are separate.
- [ ] Actual bytecode cards include the exact local Python implementation and
  version plus a caveat; illustrative cards say they are not captured output.
- [ ] HTML visuals have keyboard, focus, contrast, motion, and text-equivalent
  support.
- [ ] Links/licenses are verified and external sources are paraphrased rather
  than copied.
