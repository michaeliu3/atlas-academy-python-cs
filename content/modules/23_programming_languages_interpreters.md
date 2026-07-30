# Module 23 — Programming Languages, Interpreters & Bounded Evaluation

> **Arc V — Languages, intelligence, and integration**
> **Bridge:** Module 22 established that incoming data does not become
> authority merely because it has a plausible shape. This module makes that
> principle operational: text can have syntax and structure without becoming
> Python code, a permission, or a capability.

**Primary outcome:** You can read a language-processing system as a chain of
representations and decisions: text, tokens, grammar, syntax tree, semantic
contract, environment, evaluation, narrow capability, result, and evidence.
You can trace lexical scope and closures from first principles, explain what
types do and do not establish, and review an “easy evaluator” patch without
mistaking it for a safe design.

This is a rigorous programming-languages module, not a puzzle about clever
ways to execute text. The hard material stays hard; the route through it stays
visible. We will build two tiny, original teaching languages:

- **Pebble** is pure and explanatory. It lets us derive trees, environments,
  functions, closures, and evaluation rules without any host-system effect.
- **Atlas Query** is small and policy-aware. It reads only a fixed vocabulary
  over a redacted local fixture after a separately authorized, narrow read
  capability is supplied.

Neither language is a subset of Python. Neither is a general sandbox. The
reference model performs no network, filesystem, process, database, package,
credential, or remote-code operation.

---

## How to study this module

Use the same short loop in every session:

1. Predict what fact a boundary has established.
2. Trace the representation before reading the explanation.
3. State the next missing fact: syntax, semantics, contract, authority, or
   resource bound.
4. Read the fixed code or model packet; do not run arbitrary source text.
5. Explain the tempting overclaim in one plain sentence.
6. Save a one-arrow diagram or a five-line trace in your notes.

The durable question is not “does this code work?” It is:

> What representation is here, what meaning has been established, what
> authority (if any) crossed, what resource promise is declared, and what
> remains unknown?

### The exact cumulative invariant

> **An external Atlas-language text remains data after it tokenizes and after
> it parses. Only an explicitly versioned grammar, AST-shape and semantic
> contract, declared resource budgets, an authenticated and authorized
> request, and a pre-minted narrow capability may select one fixed evaluator
> operation. The evaluator has no ambient Python authority and cannot turn
> source text into imports, attribute access, arbitrary calls, file, process,
> database, network, or raw-log access. Its result is a bounded, redacted
> local model observation that says what it does and does not prove.**

This is an Atlas teaching contract. It is not a complete security sandbox,
production policy service, formal proof of language safety, compiler,
operating-system boundary, or performance guarantee.

### Evidence labels

| Label | What the boundary established | What it still did not establish |
|---|---|---|
| **[INPUT DATA]** | Atlas received characters or bytes. | The text is valid, true, authorized, or executable. |
| **[LEXICAL STRUCTURE]** | A bounded scan recognized declared tokens. | The tokens form a legal program/query. |
| **[SYNTAX ONLY]** | A declared grammar accepted an arrangement of tokens. | Names, types, business meaning, authority, or effects are permitted. |
| **[PERMITTED LANGUAGE FORM]** | A frozen, allow-listed Atlas AST shape was accepted. | The request may read a real data source. |
| **[CONTRACT CHECKED]** | A fixed schema, domain, and comparator rule passed. | A subject may perform the requested read. |
| **[AUTHORIZED]** | The Module 22 tuple permitted one named action. | The evaluator has arbitrary host authority. |
| **[NARROW CAPABILITY]** | Trusted host code supplied one fixed-scope adapter. | Query text may choose an API, file, function, or scope. |
| **[LOCAL MODEL]** | A deterministic course fixture produced an outcome. | A remote service saw the same input or result. |
| **[LOCAL OBSERVATION]** | The model recorded a bounded decision/outcome. | The record proves an external effect or global truth. |
| **[UNKNOWN]** | Current evidence does not settle the claim. | The desired conclusion is false. |

### Runtime evidence card

~~~text
Reference: module23_reference.py
Tests:     test_module23_reference.py (43 behavioral checks)
Runtime:   local CPython evidence environment
Effects:   no network, file, process, database, package, credential, or remote-code action
Input:     fixed scenario names only; the CLI does not accept arbitrary query text
Core rule: custom Atlas Query lexer/parser; never source → Python evaluator
Provenance: private seals model the course path; they are not hostile same-process isolation
~~~

**Runtime artifacts:** [download the local reference model](/downloads/module23_reference.py)
and [download the behavioral tests](/downloads/test_module23_reference.py).

From the work directory, inspect the model’s accepted fixed scenario names,
then read one packet:

~~~text
python module23_reference.py --help
python module23_reference.py successful_count
python test_module23_reference.py
~~~

Do not turn the command line into a text-evaluation service. Fixed scenarios
let you inspect a contract without quietly expanding the attack surface.

---

## 1. Position in the knowledge system

### 1.1 The bridge from Module 22

Module 22 ended with this deliberately incomplete chain:

~~~text
input text
→ grammar
→ parser
→ typed/canonical representation
→ bounded evaluation environment
→ narrow capability
→ result/error with redacted evidence
~~~

Module 23 names the distinct facts at each arrow. It also preserves the
earlier Atlas ideas:

- Module 1: names bind to objects; changing a binding differs from changing an
  object.
- Modules 3 and 6: representations have invariants and operation costs.
- Modules 12–16: contracts, tests, architecture, data boundaries, and
  transactions make effects reviewable.
- Modules 17–21: layers, resources, concurrency, requests, retries, and
  traces produce bounded local evidence rather than magic global knowledge.
- Module 22: an external value is data until a boundary explicitly makes a
  smaller, justified decision.

~~~mermaid
flowchart LR
    M1["M1: bindings and state"] --> P["Pebble: names, environments, values"]
    M3["M3/6: invariants + representation"] --> A["AST and grammar contracts"]
    M12["M12–16: API + tests + effects"] --> E["parse → validate → evaluate"]
    M20["M20–22: request, trust, authority"] --> Q["Atlas Query capability boundary"]
    P --> R["deterministic language meaning"]
    A --> R
    E --> R
    Q --> B["bounded local result + evidence"]
    B --> M24["M24: CPython implementation and measured cost"]
~~~

**Text equivalent:** Pebble explains how a tree gets meaning from environments
and rules. Atlas Query applies the same parser/evaluator separation to a
read-only learning metric, then adds Module 22’s scoped authorization before a
fixed capability is handed in. Module 24 will ask how CPython implements and
measures a trusted Python program; it does not retroactively make bytecode
the language specification.

### 1.2 The fixed Atlas incident

After the delayed-import investigation, an analyst asks for a small aggregate
over a redacted local learning-event snapshot. A generated patch proposes the
following shortcut. Read it as a contract audit; do not run it.

~~~python
# Deliberately flawed review fixture — not an execution exercise.
def summarise(request, record_context):
    return eval(request.query_text, {"__builtins__": {}}, record_context)
~~~

No clever input is needed to reject this design. It collapses too many
different decisions:

| Promotion | What the patch silently does | What a review must ask |
|---|---|---|
| text → Python source | A domain query becomes a host-language expression. | Which grammar did we actually promise to support? |
| context → name-resolution surface | Records become names available to source text. | Which names and values are permitted? |
| parse/evaluate → authority | A result appears without a Module 22 decision. | Who may read which metric for which cohort and purpose? |
| restricted builtins → sandbox claim | A namespace trick is treated as containment. | Which documented boundary actually prevents host effects? |
| result → evidence | Output may expose raw data or overstate a local result. | What minimum, redacted observation may we keep? |

The course response is intentionally boring:

~~~text
fixed local request fixture
  → input length + encoding policy
  → original Atlas Query lexer
  → original Atlas Query parser
  → frozen AST-shape + schema/domain contract
  → M22 authorization decision
  → pre-minted ReadLearningMetric capability
  → node/depth/fuel/output-bounded evaluator
  → redacted local evidence packet
~~~

**Stopping line:** A parser does not hand out an API key. A type hint does not
authorize a read. An evaluator only sees the values and capability explicitly
given to it.

### 1.3 Two languages, one connected mental model

~~~text
Pebble (pure explanatory language)            Atlas Query (bounded policy language)
----------------------------------            -------------------------------------
text → tokens → AST                            text → tokens → AST
                 ↓                                            ↓
          environment + closures                        schema + contracts
                 ↓                                            ↓
      deterministic evaluator                         M22 authorization
                 ↓                                            ↓
       value | language error                   fixed read capability
                                                          ↓
                                          bounded result | redacted evidence
~~~

Pebble has no host effects, which makes semantics visible. Atlas Query has no
user-controlled functions, attribute access, imports, mutation, loops,
reflection, paths, URLs, commands, or host names. The two languages are
connected by representation and evaluation, not by an unsafe claim that a
Python closure or a dictionary of globals is a security boundary.

---

## 2. Session 1 — Text has form, not permission

### Pressure

“The query parser accepted it, so Atlas knows what to do.”

No. A parser can establish membership in a grammar. It cannot establish
whether a metric exists, whether an operator makes domain sense, whether a
request is authorized, or whether an effect is safe.

### Derive the pipeline from first principles

Characters are not tokens. Tokens are not a legal arrangement. A legal
arrangement is not a domain request. A domain request is not a permission.
Name the representation at every transition:

~~~mermaid
flowchart LR
    T["count(where cohort = &quot;atlas&quot;)\
[INPUT DATA]"] --> L["COUNT · WHERE · FIELD · = · STRING\
[LEXICAL STRUCTURE]"]
    L --> G["Count(Filter(...))\
[SYNTAX ONLY]"]
    G --> C["known field + legal comparator\
[CONTRACT CHECKED]"]
    C --> D["M22 exact tuple\
[AUTHORIZED]"]
    D --> K["ReadLearningMetric\
[NARROW CAPABILITY]"]
    K --> O["count = 2\
[LOCAL MODEL]"]
~~~

**Plain language:** each stage answers a smaller question than “may Atlas
act?”  
**Precise language:** a typed representation carries only the invariants its
constructing boundary established.

### A small grammar is a public contract

This original grammar is intentionally much smaller than Python:

~~~text
query   ::= "count" "(" filter ")"
          | "mean" "(" METRIC "," filter ")"
filter  ::= "where" FIELD CMP LITERAL
          | "where" FIELD CMP LITERAL "and" FIELD CMP LITERAL
FIELD   ::= fixed schema field names only
METRIC  ::= fixed metric names only
CMP     ::= "=" | ">=" | "<="
~~~

Grammar notation is a compact way to say what forms the parser may accept:

| Notation | Read it as | Example here |
|---|---|---|
| `::=` | “may have this form” | `query ::= ...` |
| `|` | “one alternative” | `count ... | mean ...` |
| quoted word | exact terminal token | `"where"` |
| capital name | category checked elsewhere | `FIELD`, `METRIC` |
| sequence | elements occur in this order | `FIELD CMP LITERAL` |

The grammar gives **syntax**. The schema later gives the precise allowed field
and metric vocabulary. Keeping those separate makes an error explainable:
“unknown character,” “grammar form incomplete,” and “unknown metric” are
different facts.

### Python-reading side card: tokens and indentation

For a short trusted Python file, Python’s lexical analysis uses indentation to
form `INDENT` and `DEDENT` tokens. That is useful code-reading evidence, not a
rule of Pebble or Atlas Query.

~~~python
if ready:
    record()
next_step()
~~~

The indentation stack helps Python group the nested call. It does not explain
the business meaning of `ready`, whether `record()` has permission to act, or
whether a query language should use indentation at all.

### Code-reading lab S1 — classify the first failure

Read each fixed fixture in order. Do not repair it by sending it to Python.

~~~text
A. count(where cohort = "atlas")
B. count(where cohort ? "atlas")
C. mean(unknown_metric, where cohort = "atlas")
D. count(where cohort = "atlas") extra
~~~

| Fixture | Earliest defensible label | Why |
|---|---|---|
| A | syntax accepted; later checks still required | Characters form the declared query shape. |
| B | lexical error | `?` is not a declared token. |
| C | contract error | The grammar can accept a METRIC-shaped token before the schema recognizes it. |
| D | parse error | The parser must reject trailing undeclared structure. |

### Session artifact

Draw your own eight-card pipeline. Write exactly one sentence below each card:

1. What representation is present?
2. What is now known?
3. What is still unproved?

End with: “A successful parse establishes ________, not ________.”

---

## 3. Session 2 — A tree gets meaning from rules

### Pressure

“The AST already contains the answer. We just need to run it.”

An AST is a structured description. It does not carry a universal meaning.
Different consumers can assign different meanings to the same shape: an
evaluator, compiler, formatter, linter, visualizer, or static checker. The
representation is data until a selected consumer applies a declared rule.

### Pebble: make meaning visible

Pebble uses values, expressions, environments, and explicit evaluation rules:

~~~text
expr    ::= INT | BOOL | NAME
          | "(" expr OP expr ")"
          | "if" expr "then" expr "else" expr
          | "let" NAME "=" expr "in" expr
          | "fun" NAME "=>" expr
          | "(" expr expr ")"
~~~

For the first evaluator slice, read four node kinds:

~~~python
Int(value=7)
Name(label="threshold")
Add(left=Int(2), right=Int(5))
If(test=Bool(True), then_branch=Int(1), else_branch=Int(0))
~~~

The evaluator’s public contract is intentionally explicit:

~~~text
evaluate(expr, environment)
  → Value
  | UnboundName(span)
  | TypeMismatch(span, expected, actual)
  | FuelExhausted(span)
~~~

No node “runs itself.” The evaluator selects the rules and receives its
environment. An unknown name is an explicit language error, not an excuse to
look through the host process for a variable with the same spelling.

### Evaluation order is a language choice

Pebble declares deterministic, left-to-right, call-by-value behavior. For
addition:

~~~text
evaluate(Add(left, right), env)
  1. evaluate left in env
  2. if it errors, preserve that error
  3. evaluate right in env
  4. if it errors, preserve that error
  5. add two integer values
~~~

For a conditional:

~~~text
evaluate(If(test, then, otherwise), env)
  1. evaluate test
  2. require a Boolean value
  3. evaluate exactly the selected branch
~~~

This matters because an AST does not tell you whether both branches run.
Semantics is the rule that says what the tree means.

~~~mermaid
flowchart TD
    I["If(True, 7, unknown_name)"] --> T["evaluate test → True"]
    T --> Y["evaluate then branch → 7"]
    T -. "never selected" .-> N["otherwise branch is not evaluated"]
    Y --> R["Value(7)"]
~~~

### Code-reading lab S2 — separate tree shape from trace

Predict the result before seeing a trace:

~~~text
if true then 40 else missing
~~~

| Step | Representation | Established fact |
|---:|---|---|
| 1 | `If(Bool(True), Int(40), Name("missing"))` | syntax/tree shape exists |
| 2 | `Bool(True)` | test evaluates to a Boolean |
| 3 | selected branch `Int(40)` | only the then branch is evaluated |
| 4 | `IntValue(40)` | Pebble result is 40 |

The absent name is present in the AST but is not looked up in this trace. That
is not an optimization accident; it is part of the stated conditional rule.

### Session artifact

Write a five-row evaluation trace for one conditional and one arithmetic tree.
At each row label either **AST**, **environment**, **value**, or **error**.
Circle the line where a semantic rule—not the parser—decides the next action.

---

## 4. Session 3 — Names live in environments; functions close over them

### Pressure

“When a function needs a name, it should look in the caller. That is where it
was invoked.”

That intuition produces a different language. Pebble uses **lexical scope**:
a function remembers the environment in which it was created. A caller can
add its own bindings without changing the meaning of a captured free name.

### Build an environment from the Module 1 model

An environment is an explicit mapping plus an optional parent:

~~~text
frame
  bindings: name → value
  parent: another frame | none
~~~

Name lookup proceeds from the current frame outward through parents. A new
binding can shadow an older one without altering the older value.

~~~mermaid
flowchart BT
    G["global frame<br>rate → 1"]
    O["outer frame<br>threshold → 3<br>parent → global"]
    C["closure value<br>parameter → record<br>body → record >= threshold<br>captured env → outer"]
    A["call frame<br>record → 4<br>parent → outer"]
    G --> O --> C --> A
~~~

**Text equivalent:** The closure carries a lexical parent. During the call,
`record` comes from the new call frame and `threshold` comes from the captured
outer frame. A caller’s unrelated `threshold` is not consulted.

### Function values are data plus a remembered environment

For Pebble:

~~~text
evaluate(fun record => body, current_env)
  → Closure(parameter="record", body=body, captured_env=current_env)
~~~

Application is then a controlled construction:

~~~text
evaluate((function_expr argument_expr), caller_env)
  1. evaluate function_expr in caller_env
  2. evaluate argument_expr in caller_env
  3. require a Closure and a value
  4. make call_frame(parameter → argument_value, parent → captured_env)
  5. evaluate body in call_frame
~~~

The parent is the closure’s captured environment, not the caller’s
environment. This is the point where a diagram is more useful than an
acronym.

### A lexical-versus-caller lookup experiment

~~~text
let threshold = 3 in
  let passes = fun record => record >= threshold in
    let threshold = 99 in
      (passes 4)
~~~

With Pebble’s lexical rule, `passes` returns true. It captured
`threshold = 3` when it was created. A caller-lookup rule would see 99 and
return false. Neither answer is “what functions naturally do”; the evaluator
rule makes a semantic commitment.

### Python contrast: bindings are not annotations

Python’s execution model defines bindings and nested scopes. `global` makes a
name refer to the module namespace; `nonlocal` refers to a binding in an
enclosing function scope. These are Python-language facts for Python code.
Pebble’s environment is our original model for making the same core idea
inspectable.

~~~python
def make_counter():
    total = 0
    def increment():
        nonlocal total
        total += 1
        return total
    return increment
~~~

Read this as a scope question, not a capability pattern. A closure can retain a
reference to data; it does not automatically enforce least privilege. In Atlas
Query, the evaluator receives a separate, fixed capability object whose scope
is verified before evaluation.

### Code-reading lab S3 — find the wrong parent

~~~python
def apply(closure, argument, caller_env):
    # Review question: which parent belongs here?
    call_env = Environment({closure.parameter: argument}, parent=caller_env)
    return evaluate(closure.body, call_env)
~~~

The bug is not Python syntax. The call frame uses `caller_env`, so the meaning
of a free variable changes with whoever called the function. For Pebble’s
declared lexical semantics, the parent must be `closure.captured_env`.

### Session artifact

Draw three frames for the `threshold` example:

1. creation environment,
2. caller environment,
3. call environment.

Put an arrow beside every name lookup. Then finish this sentence:
“A closure is a function body plus ________, so the free name ________ resolves
to ________.”

---

## 5. Session 4 — Contracts make invalid states visible

### Pressure

“The query is typed, so it is valid and safe.”

Static typing, runtime checks, schema validation, authorization, and resource
limits answer different questions. Combining them into one word—“validated”—
makes code harder to review.

### The check matrix

| Check | Input it receives | Fact it establishes | It does not establish |
|---|---|---|---|
| lexical scan | bounded text | declared token shapes and spans | grammar membership |
| parser | token sequence | declared syntax shape | known field/metric |
| AST allow-list | AST node tags and depth | permitted language form | domain request may run |
| schema/domain validator | field, metric, comparator, literal | fixed vocabulary and type/domain rule | subject is permitted |
| static annotation/checker | program declarations | evidence in the checker’s static model | received data matches at runtime |
| runtime contract | a concrete received representation | this model’s explicit condition held | cross-tenant policy permits a read |
| M22 authorization | subject/action/resource/tenant/purpose | one scoped decision | arbitrary host access |
| fuel/output limit | planned evaluator work | local model stopped at declared bound | host process is globally safe |

### A type hint is a useful claim, not a runtime guard

~~~python
def mean(metric: str, cohort: str) -> float:
    ...
~~~

This can help a reader and a static checker reason about intended interfaces.
It does not itself:

- reject an incoming object,
- verify that the metric belongs to the Atlas vocabulary,
- prove that a cohort is in scope,
- authorize access,
- limit resource use, or
- prevent a side effect.

In Python 3.14, annotations are also not necessarily inert comments:
introspection can be an evaluation-adjacent boundary depending on how an
annotation is obtained. The Atlas model therefore neither evaluates
untrusted annotations nor treats a type expression as a policy.

### Semantic contract for Atlas Query

The grammar accepts category-shaped tokens; the contract makes the categories
concrete:

~~~text
FIELD  = cohort | confidence | completed
METRIC = confidence
CMP    = = | >= | <=

cohort     accepts a non-empty string literal and only =
confidence accepts an integer literal from 1 through 5 and =, >=, or <=
completed  accepts an integer literal 0 or 1 and only =
mean(confidence, filter) is the only mean operation in this fixed fixture
~~~

Every rejection says **which layer** stopped it:

~~~text
LEX_ERROR               unsupported character; a numeric failure span is redacted safely
PARSE_ERROR             expected ')' after filter; missing end text has no character span
CONTRACT_ERROR          metric is not permitted
CONTRACT_ERROR          literal type does not match field
DENIED_AUTHORIZATION    request tuple or scoped filter is outside fixed policy
CAPABILITY_DENIED       no pre-minted narrow capability reached the evaluator
FUEL_EXHAUSTED          local evaluator stopped at declared fuel budget
RESULT_LIMIT_EXCEEDED   aggregate cardinality exceeded the declared local cap
~~~

### Code-reading lab S4 — choose the earliest boundary

| Claim | Best first boundary | Why |
|---|---|---|
| A field token spells `impossible_field`. | schema/domain validation | It can have the right token shape while lacking a declared meaning. |
| A `?` appears in source. | lexical scan | No AST or policy decision should be attempted. |
| A query asks for a known field using text where only an integer is allowed. | contract/type/domain validation | Syntax does not express the field’s value domain. |
| A known, well-typed query targets the wrong tenant. | authorization | Domain meaning is valid; authority is separate. |
| A known, authorized query exceeds declared work fuel. | evaluator budget | The model may stop without calling it malformed or unauthorized. |

### Session artifact

Make a “not the same as” chain:

~~~text
type annotation ≠ runtime contract ≠ schema/domain meaning ≠ authorization ≠ resource bound
~~~

For each `≠`, write a one-line example of a claim that can still be false.

---

## 6. Session 5 — Bounded evaluation receives authority, never finds it

### Pressure

“We filtered the input and removed builtins, so the evaluator is contained.”

No. Python documentation explicitly warns that `eval` and `exec` execute
arbitrary code and that changing the builtins mapping is not a security
mechanism. A local fuel counter is useful for our model’s declared work, but
it is not operating-system containment. An audit hook can observe events; it
is not a general sandbox.

### The narrow capability rule

Atlas Query source cannot spell a host function name. It cannot choose a
tenant/scope, adapter, or metric vocabulary outside the fixed contract. An
allow-listed cohort filter may narrow the fixed scope, but a cross-scope value
is denied and an omitted cohort filter remains bounded by the capability. The
evaluator receives a pre-minted model object only after Module 22
authorization:

~~~mermaid
flowchart LR
    Q["validated query plan<br>[CONTRACT CHECKED]"] --> A["exact M22 tuple<br>subject/action/resource/tenant/purpose"]
    A --> D{"policy permits?"}
    D -- no --> N["DENIED_AUTHORIZATION<br>redacted evidence"]
    D -- yes --> C["ReadLearningMetric<br>scope + vocabulary fixed by host"]
    C --> E["bounded evaluator"]
    E --> R["RESULT | FUEL_EXHAUSTED | RESULT_LIMIT_EXCEEDED<br>[LOCAL OBSERVATION]"]
~~~

The capability is deliberately small:

~~~text
ReadLearningMetric(
  tenant = "atlas",
  purpose = "course-quality-review",
  metric_vocabulary = ("confidence",),
  records = none; adapter = none
)
~~~

It does not contain a database connection, URL, file handle, arbitrary
callable, or raw record logger. Query text does not construct it.

**Scope and seal caveat:** the evaluator independently excludes every fixture
record whose cohort differs from the capability tenant, even if the query
omits a cohort filter. The model’s private seal objects demonstrate provenance
on this cooperative local path; they are not unforgeable authority or
process-isolation primitives for hostile in-process Python.

### Resource limits are separate, named contracts

The local model declares several limits:

| Limit | Stops | Remaining nonclaim |
|---|---|---|
| input size | oversized source before lexing | a short source is harmless in every host |
| token count | excessive token stream | all memory allocation risk |
| AST depth/node count | overly complex tree | a general parser sandbox |
| evaluator fuel | too many declared evaluation steps | operating-system CPU containment |
| aggregate/result cap | too much modeled output | real data-service pagination/security |

This separation is more honest and more useful than one magic adjective such
as “safe.”

### Code-reading lab S5 — inspect the truthful happy-path excerpt

~~~python
def successful_packet():
    source = 'count(where cohort = "atlas")'
    input_check = check_input_budget(source)
    assert input_check.normalized_text is not None
    lexed = lex_query(input_check.normalized_text)
    parsed = parse_query(lexed.tokens)
    validated = validate_query(parsed.ast)
    assert validated.plan is not None
    decision = authorize_query(fixture_authorized_request(), validated.plan)
    capability = mint_read_capability(decision)
    evaluated = evaluate_query(validated.plan, capability)
    return redact_evidence(
        "successful_count",
        input_check=input_check,
        lexed=lexed,
        parsed=parsed,
        validated=validated,
        decision=decision,
        capability=capability,
        evaluated=evaluated,
    )
~~~

This is a deliberately labelled success-path reading excerpt, not a
general-purpose query service: the full reference model handles every earlier
rejection and accepts fixed scenario names only at its CLI.

Ask six questions, one per line:

1. Which function turns characters into tokens?
2. Which function knows the domain vocabulary?
3. Which function carries forward Module 22’s exact tuple?
4. Where can a denied decision prevent capability minting?
5. What capability is visible to the evaluator?
6. Which data is deliberately absent from the final evidence packet?

The code is not “safe because it is short.” Its reviewability comes from its
named stages, narrow inputs, explicit failures, and intentionally absent host
authority.

### Session artifact — one decision record

Write a compact Atlas Query record:

~~~text
grammar_version:
schema_version:
subject/action/resource/tenant/purpose:
syntax outcome:
contract outcome:
authorization outcome:
capability state:
budget state:
local result label:
evidence omitted:
limitations:
~~~

Do not write the raw query, raw event record, capability internals, or any
external credential. State why each omission is purposeful.

---

## 7. Session 6 — Implementation evidence is not semantic law

### Pressure

“The disassembly proves what Python means and what will be fast.”

Disassembly is an observation of a particular CPython build and version. It
can help you ask sharper implementation and performance questions. It is not
the Python language specification, a portable opcode contract, a sandbox
boundary, or a benchmark result.

### From trusted Python source to an implementation observation

For one short, bundled source snippet only:

~~~python
def increment(value):
    return value + 1
~~~

the conceptual route is:

~~~text
trusted bundled source
  → ast.parse observation
  → compiler/code-object idea
  → disassembly observation
  → CPython / Python-version-specific question
~~~

The word **trusted** matters. Module 23 never sends external Atlas Query text
to Python parsing or compilation APIs. The module also never grades you on
memorizing opcode names.

The downloadable local model makes this evidence concrete without calling the
sample: it parses the fixed bundled `increment` source into an AST, inspects an
already-defined matching function’s code object with `dis.get_instructions`, and
returns AST node kinds, opcode names, and the exact local implementation and
version label. That is evidence about this local runtime—not a portable
semantic, authorization, or performance claim.

### Four claim owners

| Claim | Correct owner |
|---|---|
| “This Pebble expression evaluates left-to-right.” | Atlas/Pebble language rule |
| “Python resolves this nested name under its execution model.” | Python language reference |
| “This local CPython build displays these instructions.” | version-labelled CPython observation |
| “This version is faster for our workload.” | a measured, reproducible performance study |

~~~mermaid
flowchart TD
    S["language meaning<br>specified rules"] --> P["trusted Python source"]
    P --> A["AST observation"]
    A --> C["compile/code object concept"]
    C --> D["dis observation"]
    D --> Q["M24 question: measure cost, allocation, and version effect"]
    D -. "does not prove" .-> X["portable semantics or safe execution"]
~~~

### Code-reading lab S6 — label the claim before accepting it

| Statement | Best label | Why |
|---|---|---|
| “The grammar accepts this Atlas Query.” | [SYNTAX ONLY] | It says nothing about schema or authority. |
| “The local evaluator returned 2.” | [LOCAL MODEL] | It describes deterministic fixture behavior. |
| “`dis` shows a bytecode instruction in this environment.” | CPython/version-specific observation | Bytecode is implementation detail. |
| “The query is safe for a real analytics service.” | unsupported / [UNKNOWN] | A local model cannot establish this production claim. |
| “A type checker accepted an annotation.” | static-analysis evidence | Runtime validation and policy remain separate. |

### Session artifact

For each of these—grammar, AST, environment, static type, capability,
bytecode—write:

1. the claim it can support,
2. one claim it cannot support,
3. who owns the stronger claim.

End with one Module 24 question you would answer by measurement rather than
intuition.

---

## 8. Atlas Language Lab — visual studio text equivalent

The portal reader provides six prediction-before-reveal views. This text route
contains the same learning route without relying on color or animation.

| View | Prediction | Reveal | Nonclaim |
|---|---|---|---|
| **Text → tree boundary** | If a string parses, may Atlas perform a read? | Parsing establishes syntax only; authorization/capability remain separate. | Parse success is not a permission. |
| **Lexer, grammar, precedence** | Which AST matches the fixed Pebble expression? | Character, token, grammar, and tree representations with distinct errors. | Python indentation behavior is not Pebble grammar. |
| **Environment theatre** | Which `threshold` does a closure see? | The closure captures its lexical parent, not its caller. | A closure is not a security boundary. |
| **Evaluation trace** | Which branch/value is evaluated next? | Left-to-right/call-by-value and conditional/short-circuit rules. | Tree shape alone does not choose an evaluation order. |
| **Contract + capability checkpoint** | What is the earliest rejecting layer? | Syntax, contract, authority, capability, and fuel are distinct outcomes. | A permitted AST does not choose a host adapter. |
| **Trusted compilation bridge** | What does one disassembly establish? | A CPython/Python-version-specific implementation observation. | Bytecode is not portable language law or a performance proof. |

Accessibility requirement: every view has a text label, keyboard-reachable
native control, visible focus, high contrast, a prose traversal order, and a
non-motion path. Local progress may record only view/reveal choices; it must
not record query text, event records, tokens, identity, policy data, or
capability-like data.

---

## 9. Eight-level problem ladder

Move only when you can explain your answer, not merely recognize a term.

| Level | Challenge | Evidence of understanding |
|---:|---|---|
| 1 | Label text, token, AST, value, capability, and evidence in one diagram. | You do not call every representation “input.” |
| 2 | Separate lexical, parse, and contract errors in four query fixtures. | You identify the earliest boundary. |
| 3 | Draw the AST for a fixed precedence example. | You distinguish concrete syntax from tree shape. |
| 4 | Trace a Pebble conditional that leaves one bad branch unevaluated. | You name the semantic rule. |
| 5 | Trace closure capture and shadowing across three environments. | You reject caller-environment lookup for Pebble. |
| 6 | Explain why a type hint and a schema validator have different evidence. | You state a remaining runtime/policy gap. |
| 7 | Review the source-to-evaluator patch and write the repaired pipeline. | You find the first authority escalation. |
| 8 | Defend an Atlas Query packet with syntax, contract, authorization, capability, budget, evidence, and limitations. | You can state what the model does not prove. |

---

## 10. Confidence-aware diagnostic — eight fast, deep checks

Choose one answer, then record confidence from 1 (guess) to 4 (could explain
and transfer). Read the explanation only after committing.

### Q1 — Parse result

An Atlas Query string successfully parses. What is the strongest conclusion?

- A. Atlas may read the requested data.
- B. The request matches the declared grammar shape; later contract,
  authorization, and budget decisions remain.
- C. The supplied subject is authenticated.
- D. The source is safe Python.

**Best answer: B.** A grammar establishes syntax only. The other choices
require different evidence and boundaries.

### Q2 — Lexer boundary

Where should an undeclared character be rejected?

- A. After authorization
- B. In the evaluator after a host function is selected
- C. During lexical scanning, with a source span
- D. By a static type checker

**Best answer: C.** An unknown character has not become a valid token or AST.
Later work should not occur.

### Q3 — Closure parent

For Pebble’s declared lexical semantics, a function’s call frame should point
to which parent environment?

- A. The caller’s current environment
- B. The environment captured when the function was created
- C. A global dictionary containing every host name
- D. The latest environment that defines the same spelling

**Best answer: B.** This makes free-name meaning depend on the definition
context rather than an unrelated caller.

### Q4 — Conditional trace

Pebble evaluates `if true then 7 else missing`. Which name lookup occurs?

- A. Both branches look up all names before choosing.
- B. Only `missing` is looked up.
- C. Neither branch is evaluated.
- D. The selected then branch evaluates; `missing` is not looked up.

**Best answer: D.** Conditional branch selection is a named semantic rule.

### Q5 — Type claims

What does a clean static type-checker result establish?

- A. A static-analysis result under that checker’s model.
- B. The received request is well formed at runtime.
- C. The request is authorized for a tenant and purpose.
- D. The evaluator cannot consume resources.

**Best answer: A.** Static communication is useful, but runtime data,
authority, and resource boundaries remain separate.

### Q6 — Narrow authority

After a known, well-typed query is authorized, what should the evaluator
receive?

- A. The full host globals dictionary.
- B. An arbitrary callable chosen by query text.
- C. A fixed-scope, pre-minted read capability.
- D. A newly opened database connection.

**Best answer: C.** Query text cannot select a host adapter or scope.

### Q7 — Fuel result

What does `FUEL_EXHAUSTED` mean in the reference model?

- A. A real service has definitely exhausted its CPU.
- B. The local evaluator stopped at its declared model budget.
- C. The query was malformed.
- D. The subject was denied authorization.

**Best answer: B.** It is a local resource observation, not a global
security or availability result.

### Q8 — Bytecode observation

What can a `dis` listing contribute here?

- A. A permanent definition of Python semantics.
- B. Proof that a query sandbox is secure.
- C. A version-labelled CPython implementation observation that motivates
  Module 24 measurement.
- D. An authorization result.

**Best answer: C.** CPython bytecode is implementation detail and can change
across versions and VMs.

---

## 11. Cumulative project — Atlas Query Language Dossier

### Scenario

An authorized Atlas analyst wants a summary over a small redacted local
learning-event fixture. A code generator has proposed to evaluate its query
string as Python. Your role is not to find a bypass. Your role is to make the
language, semantic decisions, authority boundary, resource promises, and
evidence record reviewable.

### Required deliverables

1. **Pipeline diagram:** Text → token → AST → contract → authorization →
   capability → result/evidence. Label every arrow with an evidence label.
2. **Grammar and AST card:** State the original Atlas Query grammar, a frozen
   AST shape, grouping rules where applicable, and three deliberately excluded
   host-language features.
3. **Pebble semantics trace:** Show one `let`/closure/shadowing example,
   environments, free-name lookup, and left-to-right/branch behavior.
4. **Contract matrix:** Give one lexical error, parse error, domain/type
   error, authorization denial, and budget exhaustion. Explain the earliest
   rejecting boundary for each.
5. **Capability card:** Name subject/action/resource/tenant/purpose/policy,
   capability owner, fixed scope, lifetime, and the authority deliberately
   absent from the evaluator.
6. **Code review:** Mark why source-to-`eval` violates the invariant without
   constructing or testing a bypass.
7. **Evidence packet:** Include versions, tagged outcomes, limits, redaction
   rule, limitation, and at least one [UNKNOWN] statement.
8. **M24 question:** Choose one CPython or performance claim that must be
   observed/measured next rather than inferred from this module.

### Minimal agent brief

Use this when directing a coding agent:

~~~text
Goal: implement only the original Atlas Query lexer/parser/evaluator model.
Allowed: standard-library data classes; fixed immutable local fixtures; explicit
input/token/AST/fuel/result limits; tagged errors; closed redacted evidence.
Forbidden: eval, exec, compile, ast.literal_eval, dynamic imports, arbitrary
calls, user-controlled adapters, filesystem/process/network/database access,
raw-query/record logging, and accepting raw text from the CLI.
Acceptance: tests distinguish lex/parse/contract/authorization/capability/fuel
outcomes and prove the evaluator cannot select ambient host authority.
~~~

### Review rubric

| Dimension | Strong evidence | Warning sign |
|---|---|---|
| Representation | Every stage names a concrete value and invariant. | “The query is validated” without saying how. |
| Semantics | Trace states evaluation rule and environment parent. | Tree shape is treated as self-executing. |
| Contracts | Earliest error boundary is precise and testable. | One generic “invalid input” outcome hides the cause. |
| Authority | Capability scope/lifetime/owner are explicit. | Parse result or type hint becomes permission. |
| Resources | Input, tree, fuel, and output constraints are named. | “Fuel makes it universally safe.” |
| Evidence | Packet is redacted, versioned, and limits its claim. | Raw query/records or inferred remote success appear in logs. |
| Implementation bridge | CPython facts are version-labelled. | An opcode is treated as language law. |

---

## 12. TA sessions, Study Partner protocol, and retrieval

### TA intake rule

Before explaining, the TA asks for:

1. one predicted boundary outcome,
2. confidence from 1–4,
3. one representation arrow,
4. the learner’s strongest claim,
5. the missing evidence that would make that claim stronger.

This detects whether the gap is grammar, tree shape, environment, semantics,
contract, authority, resource reasoning, or claim scope. Do not answer a
scope question by assigning more parser typing drills.

### TA studios

| Studio | TA prompt | Learner artifact |
|---|---|---|
| Parser triage | “What is the earliest boundary that can reject this fixture?” | Error-to-layer table |
| Tree trace | “What node is next, and which rule chose it?” | Five-step evaluation trace |
| Closure clinic | “Which parent environment owns this free name?” | Three-frame environment diagram |
| Contract split | “What does this annotation/check actually establish?” | Not-the-same-as chain |
| Capability review | “Where first does authority appear, and what cannot the evaluator do?” | Capability card |
| CPython claim audit | “Is this language law, CPython evidence, Atlas fixture, or unknown?” | Claim-owner table |

### Study Partner routine — 20 to 30 minutes

1. Partner A gives one fixed fixture and asks for a prediction.
2. Partner B labels the representation at each boundary aloud.
3. Partner A changes exactly one fact: a token, field, environment parent,
   policy tuple, or fuel budget.
4. Partner B says which outcome changes and which facts remain unchanged.
5. Reverse roles.
6. Finish with: “What would we need to observe before making a stronger
   claim?”

The Study Partner should challenge leaps such as “it parsed,” “it is typed,”
or “the builtins dictionary is empty” with a boundary question, never an
exploit demonstration.

### Retrieval schedule

| When | Retrieval prompt |
|---|---|
| next day | Draw text → AST → contract → capability without notes. |
| three days | Trace a closure and identify its parent environment. |
| one week | Separate static type evidence, runtime contract, and authorization. |
| two weeks | Explain why a local fuel limit and a host sandbox claim differ. |
| one month | Label four source/bytecode claims by their correct owner. |

---

## 13. Resource route and source discipline

### Python 3.14 public contracts

- [Lexical analysis](https://docs.python.org/3.14/reference/lexical_analysis.html)
  for Python tokens and indentation; it is a Python-reading source, not an
  Atlas Query grammar.
- [Full grammar specification](https://docs.python.org/3.14/reference/grammar.html)
  and [PEP 617](https://peps.python.org/pep-0617/) for grammar/PEG context;
  use them as reference material rather than a demand to implement Python.
- [Execution model](https://docs.python.org/3.14/reference/executionmodel.html)
  for code blocks, frames, name binding, free variables, `global`, and
  `nonlocal`.
- [`tokenize`](https://docs.python.org/3.14/library/tokenize.html) and
  [`ast`](https://docs.python.org/3.14/library/ast.html) for trusted-source
  observation; Python notes syntax/scoping/resource limitations that make
  them unsuitable as the Atlas boundary.
- [`eval`, `exec`, and `compile`](https://docs.python.org/3.14/library/functions.html)
  for the explicit warning that namespace tricks are not a security mechanism.
- [`typing`](https://docs.python.org/3.14/library/typing.html) and the
  [type-system specification](https://typing.python.org/en/latest/spec/type-system.html)
  for the static-versus-runtime distinction.
- [`dis`](https://docs.python.org/3.14/library/dis.html) for the explicit
  implementation-detail caveat.
- [`resource`](https://docs.python.org/3.14/library/resource.html) and
  [`sys.addaudithook`](https://docs.python.org/3.14/library/sys.html#sys.addaudithook)
  for resource/visibility boundaries; neither makes this teaching model a
  sandbox.

### University sequence sources

These guide teaching order, not Python semantics or security guarantees:

- [Brown CSCI 1730 interpreter assignment](https://cs.brown.edu/courses/csci1730/2024/interpreter.html)
  for small grammar → AST → evaluator → tests sequencing.
- [Cornell CS 3110 interpreter introduction](https://courses.cs.cornell.edu/cs3110/2021sp/textbook/interp/intro.html)
  for the conceptual distinction between an interpreter, compiler, bytecode
  VM, and JIT.
- [UC Berkeley CS 61A Scheme specification](https://site.cs61a.org/articles/scheme-spec/)
  for visual environment/frame teaching inspiration.

### Licensing note

The explanations, diagrams, grammar, fixtures, prompts, code, and assessments
in this workbook are original. External documentation, PEPs, CPython material,
and university sources are linked and paraphrased rather than reproduced.
Python documentation is available under the PSF License Version 2, and its
code examples also carry a Zero-Clause BSD permission; preserve attribution
when reusing any external material.

---

## 14. Handoff — what Module 23 deliberately leaves open

Atlas now has a language-level chain that keeps text, syntax, semantics,
authority, resources, and evidence distinct:

~~~text
text
→ bounded tokens
→ original AST
→ semantic contract
→ explicit authorization
→ fixed capability
→ bounded local result
→ redacted evidence
~~~

But the learner should now ask a deeper implementation question:

> When trusted Python source does run, what objects, frames, bytecode,
> allocations, caches, compiler choices, and measurements lie beneath the
> language-level story—and what must be observed rather than guessed?

Module 24 moves underneath the semantic boundary into CPython, performance,
and memory. It preserves Module 23’s claim discipline: bytecode is a
version-labelled observation, measurements need controlled evidence, and a
fast-looking operation is not automatically a safe or portable conclusion.
