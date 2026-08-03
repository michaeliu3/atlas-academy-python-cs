# M21–M24 official calibration — 2026-08-03

## Scope and authoring/release boundary

This is a narrow, read-only primary-source calibration of the current M21–M24
workbooks and their existing claim routes. All external links below were
accessed on **2026-08-03**. It identifies only factual or first-principles
connections whose absence could cause an overclaim; it makes no curriculum,
source-map, contract, availability, status, CI, deployment, or release change.

Atlas remains original and link/cite-only: this note does not authorize copying
documentation, standards prose, university course assets, exercises, or code.
It is not a learner-mastery, human-review, security approval, institutional
equivalence, or publication finding. The current candidate-only/legacy
boundaries and open release-evidence criterion remain exactly as recorded.

## Alignment confirmed

| Module | Alignment and official calibration route |
| --- | --- |
| **M21 — Async and Distributed Systems** | The distinction among a coroutine, a locally owned task, cancellation, a timeout, and an unresolved remote operation is correct. Its fixed full-cut policy does not become a consistency, durability, or availability claim. Python's [coroutines and tasks documentation](https://docs.python.org/3.14/library/asyncio-task.html) supplies the local API contract; MIT [6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.5840/) calibrates the deliberately excluded replication, fault-tolerance, and implementation-lab depth. |
| **M22 — Security, Privacy, and Trust Boundaries** | The receiving-boundary sequence—input claim, format/meaning, authentication, exact authorization, fixed adapter, and redacted evidence—remains sound. The archive lesson correctly treats Python 3.14's data filter as mitigation rather than proof, and the audit-hook lesson correctly refuses a sandbox claim; see Python [tarfile](https://docs.python.org/3.14/library/tarfile.html) and [sys.addaudithook](https://docs.python.org/3.14/library/sys.html#sys.addaudithook). Stanford [CS155](https://cs155.stanford.edu/info.html) confirms that the omitted adversarial targets and projects are a deliberate depth/safety boundary. |
| **M23 — Programming Languages and Interpreters** | Text → tokens → AST → declared semantics → contract/authority/capability retains the necessary distinction between structure and permission. The lexical-scope treatment agrees with the Python [execution model](https://docs.python.org/3.14/reference/executionmodel.html); the prohibition on source-to-eval is supported by Python's explicit [eval/exec](https://docs.python.org/3.14/library/functions.html#eval) security warning. Stanford [CS242](https://web.stanford.edu/class/cs242/coursework.html) calibrates the broader theory/programming work intentionally left outside the bounded evaluator. |
| **M24 — CPython, Performance, and Memory Evidence** | The claimed separation among direct object size, traced allocations, process/native observations, CPython bytecode, and controlled measurements is correct. Python documents direct-object scope in [sys.getsizeof](https://docs.python.org/3.14/library/sys.html#sys.getsizeof), traced-allocation scope in [tracemalloc](https://docs.python.org/3.14/library/tracemalloc.html), the CPython implementation-detail caveat in [dis](https://docs.python.org/3.14/library/dis.html), and GC conditions in [timeit](https://docs.python.org/3.14/library/timeit.html). MIT [6.172](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/) supports evidence before optimization without requiring its C/cache/project depth. |

## Focused repairs for a later authoring pass

1. **P1 — make M21 task-start timing precise.** At
   content/modules/21_async_distributed_systems.md:284–329 (the
   create-task row and immediate-after checkpoint), with the associated source
   route at content/source-maps/module21_async_distributed_source_map.md:441–448,
   add one caveat:

   > Returning from create_task establishes an owned local Task. In this fixture
   > it is scheduled to run soon, but Python 3.14 can start it eagerly during
   > task creation. Do not infer that no child code has run, or that creation
   > order is start order; use an explicit start/admission gate if that
   > distinction matters.

   Python 3.14 adds eager_start and allows the task-factory mode to determine
   whether a task runs eagerly; TaskGroup.create_task forwards task-creation
   keyword arguments. This is a local timing/ownership correction only, not a
   remote-effect claim. See [Creating Tasks](https://docs.python.org/3.14/library/asyncio-task.html#creating-tasks)
   and the [eager task factory](https://docs.python.org/3.14/library/asyncio-task.html#eager-task-factory).

2. **P1 — make the M21 → M22 inbound-trace handoff operational.** M21 already
   says a trace is not trust at 21_async_distributed_systems.md:861–876, but
   M22's boundary card and trace-promotion exercise at
   22_security_privacy_trust_boundaries.md:221–274 stop before deciding how an
   inbound traceparent/tracestate is parsed, retained, or forwarded. Add one
   short **trace-disposition** card: at an external boundary, record a policy
   to restart/drop or spec-compliantly continue only a format-, size-, privacy-,
   and trust-bounded context; use a generated/redacted local correlation
   reference for evidence; never promote it to authentication or authorization.
   Name tracestate as opaque vendor data rather than a safe log field.

   This closes an actual first-principles bridge without adding observability
   implementation. The [W3C Trace Context privacy](https://www.w3.org/TR/trace-context/#privacy-considerations)
   and [security](https://www.w3.org/TR/trace-context/#security-considerations)
   sections require attention to sensitive information, header abuse, parsing,
   sampling abuse, and boundary-specific restart/propagation choices.

3. **P2 — carry M21 partial-effect reasoning into the M22 archive card.** At
   22_security_privacy_trust_boundaries.md:437–453, add a two-sentence
   nonclaim after the metadata exercise: preflight metadata inspection is not
   an effect-time guarantee; if a later product extracts, it needs an
   operation-owned destination, per-member/effect-time policy, resource and
   collision limits, and partial-output cleanup/accounting. State explicitly
   that Atlas remains metadata-only and should not add a real extraction lab.

   Python's [extraction-filter documentation](https://docs.python.org/3.14/library/tarfile.html#extraction-filters)
   says the filter runs immediately before each member and that an aborted
   extraction can leave partial output; its [further-verification guidance](https://docs.python.org/3.14/library/tarfile.html#hints-for-further-verification)
   also identifies resource, collision, duplicate-member, and live-destination
   risks. This is a short boundary clarification, not a request to expand the
   inert reference model.

## Deliberate omissions

No additional high-value repair was found for M23 or M24. In particular, this
calibration does not ask for a general sandbox, compiler backend, hostile-code
exercise, production trace collector, remote/distributed lab, real archive
extractor, mandatory host benchmark, or a claim beyond a version-labelled
CPython observation or measurement manifest. Those would exceed the intended
bounded route rather than repair it.

The three recommendations above are authoring-only candidates. Applying any of
them later would still require its own scoped review; this research note neither
changes release/availability truth nor supplies source approval, accessibility,
CI, deployment, or publication evidence.

