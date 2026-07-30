// @ts-check

/**
 * @typedef {"A" | "B" | "C" | "D"} OptionId
 * @typedef {"low" | "medium" | "high"} Confidence
 * @typedef {"ready" | "verify" | "repair"} DiagnosticTier
 *
 * @typedef {{
 *   id: OptionId;
 *   text: string;
 *   diagnosis: string | null;
 *   feedback: string;
 * }} DiagnosticOption
 *
 * @typedef {{
 *   moduleNumber: number;
 *   moduleTitle: string;
 *   section: string;
 *   href: string;
 * }} DiagnosticRoute
 *
 * @typedef {{
 *   id: string;
 *   number: number;
 *   arc: "I" | "II" | "III";
 *   category: string;
 *   placementArea: string;
 *   prompt: string;
 *   context?: string;
 *   code?: string;
 *   codeLanguage?: "python" | "sql";
 *   options: readonly DiagnosticOption[];
 *   correctOptionId: OptionId;
 *   rationale: string;
 *   confidencePrompt: string;
 *   connection: string;
 *   route: DiagnosticRoute;
 * }} DiagnosticQuestion
 *
 * @typedef {{
 *   optionId?: OptionId;
 *   confidence?: Confidence;
 *   revealed: boolean;
 * }} DiagnosticResponse
 *
 * @typedef {{
 *   schemaVersion: number;
 *   assessmentVersion: string;
 *   currentQuestionId: string;
 *   responsesByQuestionId: Record<string, DiagnosticResponse>;
 *   completed: boolean;
 *   updatedAt: string;
 * }} DiagnosticAttempt
 */

export const DIAGNOSTIC_SCHEMA_VERSION = 1;
export const DIAGNOSTIC_ASSESSMENT_VERSION =
  "intermediate-advanced-2026-07-29-v1";
export const DIAGNOSTIC_STORAGE_KEY =
  "atlas-academy:diagnostic:intermediate-advanced-v1";

/** @type {readonly { id: Confidence; label: string; description: string }[]} */
export const confidenceLevels = [
  {
    id: "low",
    label: "Low",
    description: "Mostly a guess; I cannot yet defend it.",
  },
  {
    id: "medium",
    label: "Medium",
    description: "I reasoned, but one alternative still feels plausible.",
  },
  {
    id: "high",
    label: "High",
    description: "I can explain it and reject the alternatives.",
  },
];

/** @type {readonly DiagnosticQuestion[]} */
export const diagnosticQuestions = [
  {
    id: "python-state-aliasing",
    number: 1,
    arc: "I",
    category: "Python state and mental execution",
    placementArea: "Python execution and semantics",
    prompt: "Which pair is correct at the end?",
    codeLanguage: "python",
    code: `tags = ["python"]
event = {"tags": tags}
snapshot = event.copy()

event["tags"] += ["sql"]
event = {"tags": ["graphs"]}`,
    options: [
      {
        id: "A",
        text: '`tags == ["python"]`; `snapshot["tags"] == ["python"]`',
        diagnosis: "PY_STATE_AUGASSIGN_ALWAYS_REBINDS",
        feedback:
          "This treats list += as pure rebinding. For a list, augmented assignment mutates the existing list in place.",
      },
      {
        id: "B",
        text: '`tags == ["python", "sql"]`; `snapshot["tags"] == ["python", "sql"]`',
        diagnosis: null,
        feedback:
          "Correct. The original name and the shallow snapshot still reach the same nested list when += mutates it.",
      },
      {
        id: "C",
        text: 'Both become `["graphs"]`',
        diagnosis: "PY_STATE_REBINDING_REWRITES_ALIASES",
        feedback:
          "Rebinding event to a new dictionary changes one name. It does not rewrite the earlier dictionary or shared list.",
      },
      {
        id: "D",
        text: '`tags == ["python", "sql"]`; `snapshot["tags"] == ["python"]`',
        diagnosis: "PY_STATE_SHALLOW_COPY_COPIES_NESTED_OBJECTS",
        feedback:
          "A shallow dictionary copy duplicates the outer dictionary, not the nested list reached through its value.",
      },
    ],
    correctOptionId: "B",
    rationale:
      "The dictionary copy creates a new outer dictionary but preserves the nested-list reference. List += mutates that shared list; rebinding event afterward changes only one name.",
    confidencePrompt:
      "Choose High only if you can draw the names, dictionaries, and shared list immediately before and after both final statements.",
    connection:
      "This same ownership model later governs representation exposure, stable hash keys, transaction boundaries, and concurrent state.",
    route: {
      moduleNumber: 1,
      moduleTitle: "Values, State, and Execution",
      section: "Worked example — draw before running",
      href: "/modules/01-values-state-execution#worked-example--draw-before-running",
    },
  },
  {
    id: "recursion-termination",
    number: 2,
    arc: "I",
    category: "Recursion, contracts, and termination",
    placementArea: "Discrete math and proof",
    prompt: "What happens when the final call runs?",
    codeLanguage: "python",
    code: `def depth(n: int) -> int:
    if n == 0:
        return 0
    return 1 + depth(n // 2)

depth(-1)`,
    options: [
      {
        id: "A",
        text: "It returns 1 because `-1 // 2 == 0`.",
        diagnosis: "PY_RECURSION_FLOOR_DIVISION_ROUNDS_TOWARD_ZERO",
        feedback:
          "Python floor division rounds down: -1 // 2 is -1, not 0. The recursive argument does not change.",
      },
      {
        id: "B",
        text: "It returns 0 because the base case implicitly includes all negative values.",
        diagnosis: "PY_RECURSION_IMPLICIT_PRECONDITION_ENFORCEMENT",
        feedback:
          "A type annotation and a base case do not enforce an unstated nonnegative-input precondition.",
      },
      {
        id: "C",
        text: "It eventually raises `RecursionError`; `-1 // 2 == -1` and the argument never approaches the base case.",
        diagnosis: null,
        feedback:
          "Correct. The call repeats with -1, so no well-founded measure decreases toward zero.",
      },
      {
        id: "D",
        text: "Python recognizes the repeated argument and stops the recursion safely.",
        diagnosis: "PY_RECURSION_AUTOMATIC_CYCLE_DETECTION",
        feedback:
          "Ordinary Python calls do not memoize arguments or detect recursive cycles automatically.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Having a base case is insufficient. A termination argument must establish that every legal recursive step decreases a well-founded measure toward that base case.",
    confidencePrompt:
      "Choose High only if you can state the missing input precondition or a valid decreasing measure.",
    connection:
      "The same proof shape later justifies recursive data structures, graph traversals, and dynamic-programming state transitions.",
    route: {
      moduleNumber: 2,
      moduleTitle: "Functions, Recursion, and Induction",
      section: "Termination: a base case is necessary but not sufficient",
      href: "/modules/02-functions-recursion-induction#5-termination-a-base-case-is-necessary-but-not-sufficient",
    },
  },
  {
    id: "adt-observation-contract",
    number: 3,
    arc: "I",
    category: "Behavioral contracts and ADTs",
    placementArea: "Contracts, testing, and design",
    prompt:
      "An EventStore contract says clients cannot mutate stored history through a returned observation. The implementation returns `self._events` directly. Which test most directly exposes the violation?",
    options: [
      {
        id: "A",
        text: "Append one event and immediately assert that `len(store.events()) == 1`.",
        diagnosis: "ADT_TEST_HAPPY_PATH_ONLY",
        feedback:
          "This confirms one happy-path value but never challenges the ownership promise in the contract.",
      },
      {
        id: "B",
        text: "Save the expected history, clear the list returned by `events()`, then assert that the store still contains the expected history.",
        diagnosis: null,
        feedback:
          "Correct. Hostile mutation through the returned observation directly tests whether representation state escaped.",
      },
      {
        id: "C",
        text: "Assert that `isinstance(store._events, list)`.",
        diagnosis: "ADT_TEST_REPRESENTATION_NOT_CONTRACT",
        feedback:
          "This couples the test to a private representation and says nothing about the public ownership behavior.",
      },
      {
        id: "D",
        text: "Run a type checker and accept the implementation if no errors appear.",
        diagnosis: "ADT_STATIC_TYPES_PROVE_RUNTIME_OWNERSHIP",
        feedback:
          "Static compatibility does not establish snapshot isolation or prevent mutation through a runtime alias.",
      },
    ],
    correctOptionId: "B",
    rationale:
      "The contract concerns an observation after hostile client mutation. A representation assertion neither establishes nor preserves that behavior.",
    confidencePrompt:
      "Choose High only if you can name the observable frame condition that the test challenges.",
    connection:
      "Behavioral contracts let one implementation replace another without exposing representation choices.",
    route: {
      moduleNumber: 3,
      moduleTitle: "Abstraction, Interfaces, and ADTs",
      section: "Contract tests, not representation tests",
      href: "/modules/03-abstraction-interfaces-adts#73-contract-tests-not-representation-tests",
    },
  },
  {
    id: "cost-hidden-membership",
    number: 4,
    arc: "I",
    category: "Cost hidden inside one loop",
    placementArea: "Data structures and algorithms",
    prompt:
      "For n distinct input items, what are the tight worst-case time and auxiliary-space bounds?",
    codeLanguage: "python",
    code: `unique = []
for item in items:
    if item not in unique:
        unique.append(item)`,
    options: [
      {
        id: "A",
        text: "Θ(n) time and Θ(n) space because the code has one visible loop.",
        diagnosis: "COST_ONE_LOOP_MEANS_LINEAR",
        feedback:
          "The membership operation performs its own scan; visible loop count alone is not a cost proof.",
      },
      {
        id: "B",
        text: "Θ(n log n) time and Θ(n) space because list membership uses binary search.",
        diagnosis: "COST_LIST_MEMBERSHIP_IS_BINARY_SEARCH",
        feedback:
          "A general Python list is not maintained in sorted order, so membership scans linearly.",
      },
      {
        id: "C",
        text: "Θ(n²) time and Θ(n) space.",
        diagnosis: null,
        feedback:
          "Correct. The growing list causes 0 + 1 + ... + (n−1) equality checks, while it stores n distinct items.",
      },
      {
        id: "D",
        text: "Expected Θ(n) time and Θ(n) space because membership is hashed.",
        diagnosis: "COST_LIST_MEMBERSHIP_IS_HASHED",
        feedback:
          "List membership is sequential equality comparison; dictionary and set membership use hashing.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "On iteration i, list membership may inspect i existing elements. Summing 0 + 1 + … + (n−1) gives quadratic time.",
    confidencePrompt:
      "Choose High only if you can write the summation whose simplification produces the bound.",
    connection:
      "This is the bridge from operational code reading to choosing a representation from its workload.",
    route: {
      moduleNumber: 5,
      moduleTitle: "Cost Models and Algorithm Analysis",
      section: "Atlas comparison: two deduplication designs",
      href: "/modules/05-cost-models-algorithm-analysis#9-atlas-comparison-two-deduplication-designs",
    },
  },
  {
    id: "lazy-shared-cursor",
    number: 5,
    arc: "II",
    category: "Lazy execution and a shared cursor",
    placementArea: "Systems and representation",
    prompt: "Which result is correct?",
    codeLanguage: "python",
    code: `source = iter([1, 2, 3, 4])
odd = (x for x in source if x % 2)

first = next(odd)
raw = next(source)
rest = list(odd)`,
    options: [
      {
        id: "A",
        text: "`first == 1`, `raw == 2`, and `rest == [3]`.",
        diagnosis: null,
        feedback:
          "Correct. The generator and direct next call advance the same source iterator one demand at a time.",
      },
      {
        id: "B",
        text: "`first == 1`, `raw == 2`, and `rest == [1, 3]`.",
        diagnosis: "ITERATOR_GENERATOR_RESTARTS",
        feedback:
          "An iterator is stateful and one-pass; the generator cannot restart the source at 1.",
      },
      {
        id: "C",
        text: "`first == 1`, `raw == 3`, and `rest == []`.",
        diagnosis: "ITERATOR_PIPELINE_EXCLUSIVELY_OWNS_SOURCE",
        feedback:
          "The generator does not exclusively own source. A direct next(source) call can consume the next raw item.",
      },
      {
        id: "D",
        text: "`first == 1`, then `raw` raises `StopIteration`.",
        diagnosis: "ITERATOR_GENERATOR_EAGERLY_CONSUMES_INPUT",
        feedback:
          "The generator pulls only enough source items to satisfy the current demand; it does not eagerly exhaust all four.",
      },
    ],
    correctOptionId: "A",
    rationale:
      "The generator and raw access share one stateful iterator. Demand for first pulls only 1; the direct call consumes 2; later generator demand sees 3 and 4.",
    confidencePrompt:
      "Choose High only if you can mark the shared source cursor after each demand.",
    connection:
      "Shared cursor ownership becomes critical in streaming pipelines, generators, async streams, and database cursors.",
    route: {
      moduleNumber: 7,
      moduleTitle: "Stacks, Queues, Iteration, and Lazy Computation",
      section: "Demand travels backward; data travels forward",
      href: "/modules/07-stacks-queues-iteration-lazy#demand-travels-backward-data-travels-forward",
    },
  },
  {
    id: "hash-key-stability",
    number: 6,
    arc: "II",
    category: "Hash-table key stability",
    placementArea: "Data structures and algorithms",
    prompt:
      "A mutable object is inserted as a dictionary key. A field used by both equality and hashing is then changed. Which invariant is violated even if one particular lookup happens to succeed?",
    options: [
      {
        id: "A",
        text: "None; dictionaries automatically relocate keys after any mutation.",
        diagnosis: "HASH_TABLE_AUTO_REINDEXES_MUTATED_KEYS",
        feedback:
          "A dictionary is not notified when arbitrary key state changes, so it cannot automatically relocate the entry.",
      },
      {
        id: "B",
        text: "Equal hashes must imply equal objects.",
        diagnosis: "HASH_CONTRACT_REVERSED",
        feedback:
          "Hash collisions are allowed. Equality implies equal hashes, but equal hashes do not imply equality.",
      },
      {
        id: "C",
        text: "Hash- and equality-relevant state must remain stable while the object is indexed.",
        diagnosis: null,
        feedback:
          "Correct. Lookup must continue using behavior consistent with the hash bucket and equality relationship at insertion.",
      },
      {
        id: "D",
        text: "Only equality must remain stable; changing the hash is harmless.",
        diagnosis: "HASH_STABILITY_NOT_REQUIRED",
        feedback:
          "The stored location was selected from the earlier hash. A changed hash can make the entry unreachable.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "A dictionary uses the key’s earlier hash to choose its location. Mutating identity-defining state can make that entry unreachable through its new behavior.",
    confidencePrompt:
      "Choose High only if you can state the directional equality–hash contract and explain why stability is a separate requirement.",
    connection:
      "The same invariant supports sets, caches, identity maps, and indexes outside Python.",
    route: {
      moduleNumber: 8,
      moduleTitle: "Hashing, Dictionaries, Sets, and Indexing",
      section: "Stability while indexed",
      href: "/modules/08-hashing-dictionaries-sets-indexing#stability-while-indexed",
    },
  },
  {
    id: "bfs-discovery-timing",
    number: 7,
    arc: "II",
    category: "BFS discovery timing",
    placementArea: "Data structures and algorithms",
    prompt: "What is the most precise review of this reachability BFS?",
    codeLanguage: "python",
    code: `while queue:
    node = queue.popleft()
    if node in seen:
        continue
    seen.add(node)

    for neighbor in graph[node]:
        if neighbor not in seen:
            queue.append(neighbor)`,
    options: [
      {
        id: "A",
        text: "It is equivalent to marking on enqueue in both result and resource bounds.",
        diagnosis: "BFS_SEEN_TIMING_COST_EQUIVALENT",
        feedback:
          "The reachable set may match, but several parents can enqueue the same not-yet-processed vertex.",
      },
      {
        id: "B",
        text: "It becomes depth-first search because marking occurs too late.",
        diagnosis: "BFS_FRONTIER_POLICY_CONFUSION",
        feedback:
          "FIFO versus LIFO determines BFS versus DFS. Seen timing affects duplicate frontier entries, not frontier policy.",
      },
      {
        id: "C",
        text: "Reachability may remain correct, but duplicate enqueues weaken the normal frontier bound; mark on enqueue to establish one discovery event.",
        diagnosis: null,
        feedback:
          "Correct. Discovery should claim the vertex when it enters the frontier, preventing competing parents from enqueuing it again.",
      },
      {
        id: "D",
        text: "It matters only when edges have negative weights.",
        diagnosis: "BFS_NEGATIVE_WEIGHT_RELEVANCE_CONFUSION",
        feedback:
          "This is an unweighted reachability resource issue, independent of negative-weight shortest-path assumptions.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Discovery and processing are different events. Delayed marking permits duplicate frontier entries even though duplicate processing is later suppressed.",
    confidencePrompt:
      "Choose High only if you can draw a graph where two queued parents enqueue the same child before that child is processed.",
    connection:
      "The distinction between discovered, finalized, and processed state recurs in shortest paths, schedulers, and concurrent work queues.",
    route: {
      moduleNumber: 10,
      moduleTitle: "Graph Algorithms and Network Models",
      section: "Discovery and finalization are different",
      href: "/modules/10-graph-algorithms-network-models#discovery-and-finalization-are-different",
    },
  },
  {
    id: "architecture-dependency-direction",
    number: 8,
    arc: "III",
    category: "Architecture and dependency direction",
    placementArea: "Contracts, testing, and design",
    prompt:
      "`domain/planner.py` imports `SqliteEventRepository` and constructs it inside `PlannerService`. The policy needs only `events_for_topic(topic)`. Which repair creates the clearest dependency direction?",
    options: [
      {
        id: "A",
        text: "Move the SQL query directly into `PlannerService`.",
        diagnosis: "ARCHITECTURE_LAYERING_BY_TECHNOLOGY",
        feedback:
          "Moving SQL inward increases the policy layer’s knowledge of persistence rather than reversing the dependency.",
      },
      {
        id: "B",
        text: "Define a narrow repository protocol on the inward-facing boundary, inject it into `PlannerService`, and choose SQLite in the composition root.",
        diagnosis: null,
        feedback:
          "Correct. Policy owns the capability it needs; the outer composition root chooses the concrete adapter.",
      },
      {
        id: "C",
        text: "Annotate the repository as `Any` so the type checker stops reporting coupling.",
        diagnosis: "ARCHITECTURE_ANY_REMOVES_COUPLING",
        feedback:
          "Removing type evidence does not remove runtime knowledge or dependency direction.",
      },
      {
        id: "D",
        text: "Keep the dependency but place the SQLite import inside the method.",
        diagnosis: "ARCHITECTURE_LOCAL_IMPORT_FIXES_DIRECTION",
        feedback:
          "Import timing changes, but PlannerService still chooses and depends on the concrete persistence mechanism.",
      },
    ],
    correctOptionId: "B",
    rationale:
      "Dependency inversion changes who knows the implementation. Moving or weakening an import does not change the underlying ownership relationship.",
    confidencePrompt:
      "Choose High only if you can draw the dependency arrows before and after the repair and identify where implementation choice belongs.",
    connection:
      "This boundary supports test doubles, storage replacement, and architecture rules without making the domain aware of delivery technology.",
    route: {
      moduleNumber: 12,
      moduleTitle: "Modules, APIs, Types, and Dependencies",
      section: "Dependency inversion from first principles",
      href: "/modules/12-modules-apis-types-dependencies#122-dependency-inversion-from-first-principles",
    },
  },
  {
    id: "debugging-flaky-evidence",
    number: 9,
    arc: "III",
    category: "Debugging flaky evidence",
    placementArea: "Contracts, testing, and design",
    prompt:
      "A test passes alone but intermittently fails in the full suite. The code reads the clock and environment and uses a class-level cache. What is the best first investigation?",
    options: [
      {
        id: "A",
        text: "Rerun until it passes and treat the green run as stronger evidence.",
        diagnosis: "DEBUGGING_RETRY_ERASES_EVIDENCE",
        feedback:
          "An unexamined green rerun discards the very ordering or environment evidence needed to explain the failure.",
      },
      {
        id: "B",
        text: "Assume it is a race and add sleeps until the failure disappears.",
        diagnosis: "DEBUGGING_SYMPTOM_NAMES_CAUSE",
        feedback:
          "Intermittence has many possible hidden inputs. A sleep changes timing without distinguishing the hypotheses.",
      },
      {
        id: "C",
        text: "Preserve the failing order and environment, record cache/clock state, then control one hidden input at a time until the failure is reproducible.",
        diagnosis: null,
        feedback:
          "Correct. This turns an intermittent observation into controlled evidence capable of separating causes.",
      },
      {
        id: "D",
        text: "Redesign the cache before preserving a minimal failing case.",
        diagnosis: "DEBUGGING_FIX_BEFORE_CAUSE",
        feedback:
          "A redesign before diagnosis can erase evidence and introduce new explanations for the behavior.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Flakiness indicates an unrecorded input. Diagnosis should preserve evidence, form competing hypotheses, and manipulate controlled variables before changing architecture.",
    confidencePrompt:
      "Choose High only if you can name one experiment that distinguishes cache contamination from clock dependence.",
    connection:
      "The same causal discipline applies to production incidents, nondeterministic agents, distributed traces, and performance regressions.",
    route: {
      moduleNumber: 13,
      moduleTitle: "Specifications, Testing, Debugging, and Observability",
      section: "Flaky and nondeterministic evidence",
      href: "/modules/13-specifications-testing-debugging-observability#13-flaky-and-nondeterministic-evidence",
    },
  },
  {
    id: "agent-retry-review",
    number: 10,
    arc: "III",
    category: "Reviewing an AI-generated retry patch",
    placementArea: "Contracts, testing, and design",
    prompt:
      "The required observation is one logical batch with no duplicated externally visible prefix. What should block acceptance?",
    codeLanguage: "python",
    code: `def deliver(batch: list[Event], sink: Sink) -> None:
    try:
        for event in batch:
            sink(event)
    except TemporaryError:
        for event in batch:
            sink(event)`,
    options: [
      {
        id: "A",
        text: "Nothing; catching the declared exception makes the operation atomic.",
        diagnosis: "AGENT_REVIEW_EXCEPTION_HANDLING_EQUALS_ATOMICITY",
        feedback:
          "Catching an exception neither rolls back earlier external effects nor proves what happened inside the failed call.",
      },
      {
        id: "B",
        text: "The loops should become comprehensions for clearer semantics.",
        diagnosis: "AGENT_REVIEW_SYNTAX_CHANGE_FIXES_SEMANTICS",
        feedback:
          "A syntax rewrite does not supply atomicity, stable operation identity, or a retry contract.",
      },
      {
        id: "C",
        text: "Earlier effects may already be visible—and the failed call may have succeeded—so replay can duplicate effects; require explicit atomicity/idempotency semantics and adversarial evidence.",
        diagnosis: null,
        feedback:
          "Correct. The patch must account for every externally possible prefix and uncertain outcome before replay is safe.",
      },
      {
        id: "D",
        text: "Happy-path tests and a clean type-check are sufficient proof.",
        diagnosis: "AGENT_REVIEW_HAPPY_PATH_PROVES_FAILURE_CONTRACT",
        feedback:
          "Those checks do not exercise failure after a visible prefix or an operation that succeeds before reporting failure.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "A caught exception does not undo external effects or establish what happened before the exception became observable.",
    confidencePrompt:
      "Choose High only if you can trace failure on the third event and list every externally possible state before retry.",
    connection:
      "AI-native engineering shifts effort from typing a patch to specifying observations, challenging hidden assumptions, and demanding adversarial evidence.",
    route: {
      moduleNumber: 14,
      moduleTitle: "Software Design and Change",
      section: "Retry requires an atomic exposure boundary",
      href: "/modules/14-software-design-and-change#103-retry-requires-an-atomic-exposure-boundary",
    },
  },
  {
    id: "artifact-pickle-boundary",
    number: 11,
    arc: "III",
    category: "Artifact integrity and executable reconstruction",
    placementArea: "Security, ethics, and user impact",
    prompt:
      "An uploaded bundle contains a pickle and a SHA-256 digest. An agent verifies that the bytes match the supplied digest, then calls `pickle.loads`. What is the strongest review?",
    options: [
      {
        id: "A",
        text: "The digest authenticates the author and makes the pickle safe.",
        diagnosis: "ARTIFACT_DIGEST_EQUALS_AUTHENTICITY",
        feedback:
          "A matching supplied digest establishes byte agreement only; an attacker can supply both malicious bytes and their digest.",
      },
      {
        id: "B",
        text: "Unpickle first and validate the reconstructed object afterward.",
        diagnosis: "ARTIFACT_VALIDATE_AFTER_EXECUTION",
        feedback:
          "Unpickling may execute behavior during reconstruction, so validation afterward crosses the trust boundary too late.",
      },
      {
        id: "C",
        text: "The digest establishes only byte agreement; it does not prove trusted provenance, and unpickling untrusted data can execute behavior.",
        diagnosis: null,
        feedback:
          "Correct. Integrity, authenticity, schema validity, and safe interpretation are distinct claims.",
      },
      {
        id: "D",
        text: "Pickle is passive data equivalent to JSON once checksummed.",
        diagnosis: "ARTIFACT_PICKLE_IS_PASSIVE_DATA",
        feedback:
          "Pickle is an executable reconstruction protocol, not a passive schema-constrained data format.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Integrity, authenticity, schema validity, and safe interpretation are separate claims. Validation after executable reconstruction is too late.",
    confidencePrompt:
      "Choose High only if you can distinguish integrity, authenticity, schema validity, and execution authority.",
    connection:
      "The same trust decomposition applies to packages, archives, model files, plugins, and agent-supplied artifacts.",
    route: {
      moduleNumber: 15,
      moduleTitle: "Files, Serialization, Packaging, and Delivery",
      section: "Pickle is executable reconstruction",
      href: "/modules/15-files-serialization-packaging-delivery#75-pickle-is-executable-reconstruction",
    },
  },
  {
    id: "sql-three-valued-logic",
    number: 12,
    arc: "III",
    category: "SQL three-valued logic",
    placementArea: "Data and persistence",
    context:
      "The attempts table contains (1, 'done'), (2, 'pending'), and (3, NULL).",
    prompt: "What IDs does this query return?",
    codeLanguage: "sql",
    code: `SELECT id
FROM attempts
WHERE status <> 'done'
ORDER BY id;`,
    options: [
      {
        id: "A",
        text: "IDs 2 and 3.",
        diagnosis: "SQL_NULL_IS_ORDINARY_NOT_EQUAL_VALUE",
        feedback:
          "NULL is not an ordinary value that compares unequal to 'done'; the comparison produces UNKNOWN.",
      },
      {
        id: "B",
        text: "ID 2 only.",
        diagnosis: null,
        feedback:
          "Correct. The pending row is TRUE, the done row is FALSE, and the NULL row is UNKNOWN; WHERE keeps TRUE.",
      },
      {
        id: "C",
        text: "ID 3 only.",
        diagnosis: "SQL_NULL_MEANS_NOT_DONE",
        feedback:
          "NULL represents missing or unknown status, not the affirmative value 'not done'.",
      },
      {
        id: "D",
        text: "No rows, because one NULL contaminates the whole query.",
        diagnosis: "SQL_THREE_VALUED_LOGIC_IS_GLOBAL",
        feedback:
          "Each row’s predicate is evaluated independently; one UNKNOWN result does not alter other rows.",
      },
    ],
    correctOptionId: "B",
    rationale:
      "For the NULL row, the comparison evaluates to UNKNOWN; WHERE retains only rows for which the predicate is TRUE.",
    confidencePrompt:
      "Choose High only if you can evaluate the predicate as TRUE, FALSE, or UNKNOWN for all three rows.",
    connection:
      "Query correctness depends on a logical model before indexes, planners, or performance enter the discussion.",
    route: {
      moduleNumber: 16,
      moduleTitle: "Relational Data and Transactions",
      section: "NULL creates three-valued predicate results",
      href: "/modules/16-relational-data-transactions#23-null-creates-three-valued-predicate-results",
    },
  },
  {
    id: "transaction-replay-identity",
    number: 13,
    arc: "III",
    category: "Transactions, uncertain outcomes, and replay identity",
    placementArea: "Data and persistence",
    prompt:
      "An import with run ID R, digest D, and ordered events E commits its rows and receipt in one transaction, but the response is lost. The client retries exactly R, D, E. What is the most defensible repository behavior?",
    options: [
      {
        id: "A",
        text: "Assume the timeout rolled the transaction back and insert all events again.",
        diagnosis: "TRANSACTION_TIMEOUT_PROVES_ROLLBACK",
        feedback:
          "A missing response describes the client’s observation, not whether the server committed before the response was lost.",
      },
      {
        id: "B",
        text: "Reject every repeated run ID, even when its meaning is identical.",
        diagnosis: "TRANSACTION_IDEMPOTENCY_MEANS_REJECT_DUPLICATE",
        feedback:
          "Blind rejection prevents safe reconciliation of a successful operation whose response was lost.",
      },
      {
        id: "C",
        text: "Compare existing run metadata and ordered events; return the prior receipt without new rows when meaning matches, but report conflict when the same ID means something different.",
        diagnosis: null,
        feedback:
          "Correct. Stable identity plus an explicit same-meaning rule makes exact replay reconcilable.",
      },
      {
        id: "D",
        text: "Enable WAL, which automatically deduplicates application operations.",
        diagnosis: "TRANSACTION_WAL_DEDUPLICATES_OPERATIONS",
        feedback:
          "WAL supports database recovery. It does not define application operation identity or deduplicate retries.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Failure to receive a response does not reveal whether commit occurred. Replay safety requires stable operation identity plus an equality rule for meaning.",
    confidencePrompt:
      "Choose High only if you can separately identify the client observation, possible committed state, atomic unit, and replay comparison.",
    connection:
      "This joins ordinary Python state reasoning to transactions and distributed uncertainty without pretending one mechanism solves every failure.",
    route: {
      moduleNumber: 16,
      moduleTitle: "Relational Data and Transactions",
      section: "Idempotency is identity plus same meaning",
      href: "/modules/16-relational-data-transactions#55-idempotency-is-identity-plus-same-meaning",
    },
  },
];

const questionById = new Map(
  diagnosticQuestions.map((question) => [question.id, question]),
);
/** @type {Set<string>} */
const confidenceIds = new Set(confidenceLevels.map((level) => level.id));

/**
 * @param {unknown} value
 * @returns {value is Confidence}
 */
function isConfidence(value) {
  return typeof value === "string" && confidenceIds.has(value);
}

/**
 * @param {string} [updatedAt]
 * @returns {DiagnosticAttempt}
 */
export function createEmptyAttempt(updatedAt = new Date().toISOString()) {
  return {
    schemaVersion: DIAGNOSTIC_SCHEMA_VERSION,
    assessmentVersion: DIAGNOSTIC_ASSESSMENT_VERSION,
    currentQuestionId: diagnosticQuestions[0].id,
    responsesByQuestionId: {},
    completed: false,
    updatedAt,
  };
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {string | unknown} raw
 * @returns {DiagnosticAttempt | null}
 */
export function parseStoredAttempt(raw) {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (
    !isRecord(value) ||
    value.schemaVersion !== DIAGNOSTIC_SCHEMA_VERSION ||
    value.assessmentVersion !== DIAGNOSTIC_ASSESSMENT_VERSION ||
    !isRecord(value.responsesByQuestionId) ||
    typeof value.currentQuestionId !== "string" ||
    !questionById.has(value.currentQuestionId) ||
    typeof value.completed !== "boolean" ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }

  /** @type {Record<string, DiagnosticResponse>} */
  const responsesByQuestionId = {};
  for (const [questionId, candidate] of Object.entries(
    value.responsesByQuestionId,
  )) {
    const question = questionById.get(questionId);
    if (!question || !isRecord(candidate)) {
      return null;
    }

    const optionId = candidate.optionId;
    const confidence = candidate.confidence;
    const revealed = candidate.revealed;
    if (optionId !== undefined && typeof optionId !== "string") {
      return null;
    }
    if (confidence !== undefined && !isConfidence(confidence)) {
      return null;
    }
    if (typeof revealed !== "boolean") {
      return null;
    }
    if (revealed && (optionId === undefined || confidence === undefined)) {
      return null;
    }
    if (
      optionId !== undefined &&
      !question.options.some((option) => option.id === optionId)
    ) {
      return null;
    }
    responsesByQuestionId[questionId] = {
      ...(optionId ? { optionId: /** @type {OptionId} */ (optionId) } : {}),
      ...(confidence
        ? { confidence: /** @type {Confidence} */ (confidence) }
        : {}),
      revealed,
    };
  }

  const allRevealed = diagnosticQuestions.every(
    (question) => responsesByQuestionId[question.id]?.revealed,
  );
  if (value.completed && !allRevealed) {
    return null;
  }

  return {
    schemaVersion: DIAGNOSTIC_SCHEMA_VERSION,
    assessmentVersion: DIAGNOSTIC_ASSESSMENT_VERSION,
    currentQuestionId: value.currentQuestionId,
    responsesByQuestionId,
    completed: value.completed,
    updatedAt: value.updatedAt,
  };
}

/**
 * @param {DiagnosticAttempt} state
 * @param {{
 *   type: string;
 *   questionId?: string;
 *   optionId?: OptionId;
 *   confidence?: Confidence;
 *   attempt?: DiagnosticAttempt;
 *   updatedAt?: string;
 * }} action
 * @returns {DiagnosticAttempt}
 */
export function diagnosticReducer(state, action) {
  const updatedAt = action.updatedAt ?? new Date().toISOString();
  if (action.type === "hydrate" && action.attempt) {
    return action.attempt;
  }
  if (action.type === "reset") {
    return createEmptyAttempt(updatedAt);
  }
  if (action.type === "goTo" && action.questionId && questionById.has(action.questionId)) {
    return { ...state, currentQuestionId: action.questionId, updatedAt };
  }
  if (action.type === "complete") {
    if (
      !state.completed &&
      diagnosticQuestions.every(
        (question) => state.responsesByQuestionId[question.id]?.revealed,
      )
    ) {
      return { ...state, completed: true, updatedAt };
    }
    return state;
  }
  if (!action.questionId) {
    return state;
  }

  const question = questionById.get(action.questionId);
  if (!question || state.completed) {
    return state;
  }
  const previous = state.responsesByQuestionId[action.questionId] ?? {
    revealed: false,
  };
  if (previous.revealed) {
    return state;
  }

  if (
    action.type === "chooseOption" &&
    action.optionId &&
    question.options.some((option) => option.id === action.optionId)
  ) {
    return {
      ...state,
      responsesByQuestionId: {
        ...state.responsesByQuestionId,
        [action.questionId]: {
          ...previous,
          optionId: action.optionId,
        },
      },
      updatedAt,
    };
  }

  if (
    action.type === "setConfidence" &&
    action.confidence &&
    confidenceIds.has(action.confidence)
  ) {
    return {
      ...state,
      responsesByQuestionId: {
        ...state.responsesByQuestionId,
        [action.questionId]: {
          ...previous,
          confidence: action.confidence,
        },
      },
      updatedAt,
    };
  }

  if (
    action.type === "reveal" &&
    previous.optionId &&
    previous.confidence
  ) {
    return {
      ...state,
      responsesByQuestionId: {
        ...state.responsesByQuestionId,
        [action.questionId]: { ...previous, revealed: true },
      },
      updatedAt,
    };
  }

  return state;
}

/**
 * @param {DiagnosticQuestion} question
 * @param {DiagnosticResponse | undefined} response
 */
export function classifyResponse(question, response) {
  if (
    !response?.revealed ||
    !response.optionId ||
    !isConfidence(response.confidence)
  ) {
    return null;
  }

  const selectedOption = question.options.find(
    (option) => option.id === response.optionId,
  );
  const correctOption = question.options.find(
    (option) => option.id === question.correctOptionId,
  );
  if (!selectedOption || !correctOption) {
    return null;
  }

  const correct = selectedOption.id === question.correctOptionId;
  /** @type {DiagnosticTier} */
  const tier = correct
    ? response.confidence === "high"
      ? "ready"
      : "verify"
    : "repair";
  const priority = correct
    ? response.confidence === "low"
      ? 3
      : response.confidence === "medium"
        ? 4
        : 5
    : response.confidence === "high"
      ? 0
      : response.confidence === "medium"
        ? 1
        : 2;

  return {
    question,
    response,
    selectedOption,
    correctOption,
    correct,
    tier,
    priority,
    misconceptionTag: selectedOption.diagnosis,
  };
}

/**
 * @param {DiagnosticAttempt} attempt
 */
export function buildDiagnosticResult(attempt) {
  const signals = diagnosticQuestions
    .map((question) =>
      classifyResponse(question, attempt.responsesByQuestionId[question.id]),
    )
    .filter((signal) => signal !== null);
  const byTier = {
    ready: signals.filter((signal) => signal.tier === "ready"),
    verify: signals.filter((signal) => signal.tier === "verify"),
    repair: signals.filter((signal) => signal.tier === "repair"),
  };
  const prioritySignals = [...signals].sort(
    (left, right) =>
      left.priority - right.priority ||
      left.question.number - right.question.number,
  );

  const routeByHref = new Map();
  for (const signal of prioritySignals.filter((item) => item.tier !== "ready")) {
    const existing = routeByHref.get(signal.question.route.href);
    if (!existing || signal.priority < existing.priority) {
      routeByHref.set(signal.question.route.href, {
        ...signal.question.route,
        priority: signal.priority,
        tier: signal.tier,
        questionNumber: signal.question.number,
        category: signal.question.category,
      });
    }
  }
  const learningRoute = [...routeByHref.values()].sort(
    (left, right) =>
      left.moduleNumber - right.moduleNumber ||
      left.priority - right.priority ||
      left.questionNumber - right.questionNumber,
  );

  return {
    questionCount: diagnosticQuestions.length,
    answeredCount: signals.length,
    correctCount: signals.filter((signal) => signal.correct).length,
    byTier,
    prioritySignals,
    learningRoute,
  };
}

/**
 * @param {DiagnosticAttempt} attempt
 */
export function toLearningBrief(attempt) {
  const result = buildDiagnosticResult(attempt);
  const lines = [
    "Atlas Academy — Module 0 learning brief",
    `Assessment: ${DIAGNOSTIC_ASSESSMENT_VERSION}`,
    `Completed responses: ${result.answeredCount}/${result.questionCount}`,
    `Correct models sampled: ${result.correctCount}/${result.questionCount}`,
    `Ready to transfer: ${result.byTier.ready.length}`,
    `Verify and strengthen: ${result.byTier.verify.length}`,
    `Repair first: ${result.byTier.repair.length}`,
    "",
    "Response signals:",
  ];

  for (const signal of result.prioritySignals) {
    lines.push(
      `Q${String(signal.question.number).padStart(2, "0")} ${signal.question.category}: ` +
        `${signal.selectedOption.id}/${signal.response.confidence} → ${signal.tier}` +
        (signal.misconceptionTag ? ` [${signal.misconceptionTag}]` : ""),
    );
  }

  lines.push("", "Connected learning route:");
  if (result.learningRoute.length === 0) {
    lines.push(
      "Instructor transfer interview first; no section was automatically skipped.",
    );
  } else {
    for (const [index, route] of result.learningRoute.entries()) {
      lines.push(
        `${index + 1}. Module ${route.moduleNumber} — ${route.section}: ${route.href}`,
      );
    }
  }

  lines.push(
    "",
    "Instructor note: treat these as hypotheses. Verify with explanation, code tracing, and transfer before compressing any module.",
  );
  return lines.join("\n");
}

export function validateDiagnosticDefinition() {
  const errors = [];
  const questionIds = new Set();
  for (const question of diagnosticQuestions) {
    if (questionIds.has(question.id)) {
      errors.push(`Duplicate question id: ${question.id}`);
    }
    questionIds.add(question.id);
    if (question.options.length !== 4) {
      errors.push(`${question.id} must have four options`);
    }
    const optionIds = new Set(question.options.map((option) => option.id));
    if (optionIds.size !== question.options.length) {
      errors.push(`${question.id} has duplicate option ids`);
    }
    if (!optionIds.has(question.correctOptionId)) {
      errors.push(`${question.id} has no matching correct option`);
    }
    for (const option of question.options) {
      if (
        option.id !== question.correctOptionId &&
        (!option.diagnosis || !option.feedback)
      ) {
        errors.push(`${question.id}/${option.id} needs diagnosis and feedback`);
      }
    }
    if (!/^\/modules\/[^#]+#[^#]+$/u.test(question.route.href)) {
      errors.push(`${question.id} has an invalid route href`);
    }
  }
  return errors;
}
