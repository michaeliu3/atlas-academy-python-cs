// @ts-check

import courseGraph from "../content/course/course-graph.v2.json" with { type: "json" };

/**
 * @typedef {"A" | "B" | "C" | "D"} OptionId
 * @typedef {"low" | "medium" | "high"} Confidence
 * @typedef {"ready" | "verify" | "repair"} DiagnosticTier
 * @typedef {"python" | "algorithms" | "systems" | "discrete-math" | "linear-algebra" | "calculus" | "probability" | "optimization" | "ai-ml"} FoundationAreaId
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
 *   moduleNumber: number;
 *   moduleTitle: string;
 *   availability: string;
 *   lifecycle: string;
 *   readerAccess: string;
 * }} DiagnosticAcademicPrerequisite
 *
 * @typedef {DiagnosticRoute & {
 *   academicPrerequisites: readonly DiagnosticAcademicPrerequisite[];
 * }} ResolvedDiagnosticRoute
 *
 * @typedef {{
 *   id: FoundationAreaId;
 *   label: string;
 *   probeQuestionId: string;
 *   whyItMatters: string;
 *   extension?: {
 *     moduleNumber: number;
 *     title: string;
 *     status: "authoring-only";
 *     note: string;
 *   };
 * }} FoundationArea
 *
 * @typedef {{
 *   id: string;
 *   number: number;
 *   arc: "I" | "II" | "III" | "IV" | "VI";
 *   category: string;
 *   placementArea: string;
 *   foundationAreas: readonly FoundationAreaId[];
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

export const DIAGNOSTIC_SCHEMA_VERSION = 2;
export const DIAGNOSTIC_ASSESSMENT_VERSION =
  "intermediate-advanced-2026-07-30-v2";
/** The full v2 attempt is retained only as a one-time migration input. */
export const DIAGNOSTIC_LEGACY_STORAGE_KEY =
  "atlas-academy:diagnostic:intermediate-advanced-v2";
/** The current v3 key stores only fixed choice/confidence/revealed triads. */
export const DIAGNOSTIC_STORAGE_KEY =
  "atlas-academy:diagnostic:intermediate-advanced-v3";

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

/**
 * Canonical coverage for the formative intake. Every `probeQuestionId` names
 * a deliberately chosen question; a correct answer is evidence to transfer,
 * not permission to skip the connected route. Advanced-extension entries
 * deliberately contain no learner-facing href because those modules are not
 * learner-released.
 *
 * @type {readonly FoundationArea[]}
 */
export const requiredFoundationAreas = [
  {
    id: "python",
    label: "Python execution and design",
    probeQuestionId: "python-state-aliasing",
    whyItMatters:
      "Trace names, mutation, and contracts before trusting an implementation or an AI-generated patch.",
  },
  {
    id: "algorithms",
    label: "Algorithms and data structures",
    probeQuestionId: "cost-hidden-membership",
    whyItMatters:
      "Choose a representation from the workload, then justify its cost and invariants.",
  },
  {
    id: "systems",
    label: "Systems and execution layers",
    probeQuestionId: "memory-locality-cache-lines",
    whyItMatters:
      "Connect source-level behavior to memory, operating-system, network, and distributed-system evidence without collapsing layers.",
  },
  {
    id: "discrete-math",
    label: "Discrete mathematics and proof",
    probeQuestionId: "quantifier-scope-countermodel",
    whyItMatters:
      "State domains and quantifier order so a proof, specification, or counterexample says exactly what it establishes.",
  },
  {
    id: "linear-algebra",
    label: "Linear algebra and representation",
    probeQuestionId: "linear-algebra-basis-coordinates",
    whyItMatters:
      "Keep the object, coordinates, and numerical representation distinct before reasoning about data or models.",
  },
  {
    id: "calculus",
    label: "Calculus and continuous change",
    probeQuestionId: "calculus-gradient-local-change",
    whyItMatters:
      "Separate a local derivative or approximation from a global conclusion, then name the assumptions that make a step legal.",
  },
  {
    id: "probability",
    label: "Probability and scientific inference",
    probeQuestionId: "probability-conditional-evidence",
    whyItMatters:
      "Declare the probability model and conditioning direction before interpreting data, uncertainty, or a model metric.",
  },
  {
    id: "optimization",
    label: "Optimization foundations",
    probeQuestionId: "optimization-feasible-descent",
    whyItMatters:
      "Make the objective, constraints, and local model explicit before accepting an optimizer step.",
    extension: {
      moduleNumber: 31,
      title: "Optimization & Information",
      status: "authoring-only",
      note:
        "The advanced extension is still authoring-only. Rebuild the open calculus and linear-algebra foundations first; this diagnostic does not unlock it.",
    },
  },
  {
    id: "ai-ml",
    label: "AI/ML reasoning foundations",
    probeQuestionId: "ml-evaluation-leakage",
    whyItMatters:
      "Challenge the data boundary, target, evaluation protocol, and uncertainty claim before trusting a learned or agent-generated output.",
    extension: {
      moduleNumber: 35,
      title: "Machine Learning & Representation",
      status: "authoring-only",
      note:
        "The advanced extension is still authoring-only. Use the open probability, calculus, and representation foundations; this diagnostic does not make the extension available.",
    },
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
    foundationAreas: ["python"],
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
    foundationAreas: ["python", "discrete-math"],
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
    foundationAreas: ["python"],
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
    foundationAreas: ["algorithms"],
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
    foundationAreas: ["python", "systems"],
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
    foundationAreas: ["python", "algorithms"],
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
    foundationAreas: ["algorithms"],
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
    foundationAreas: ["python", "systems"],
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
    foundationAreas: ["python", "systems"],
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
    foundationAreas: ["python", "systems"],
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
    foundationAreas: ["python", "systems"],
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
    foundationAreas: ["discrete-math", "systems"],
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
    foundationAreas: ["python", "systems"],
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
  {
    id: "memory-locality-cache-lines",
    number: 14,
    arc: "IV",
    category: "Memory hierarchy and locality",
    placementArea: "Systems and execution layers",
    foundationAreas: ["systems"],
    prompt:
      "Two implementations read every fixed-width record exactly once and produce the same output. One walks the stored records in address order; the other visits them in a randomized order. A machine fetches contiguous cache lines. What is the strongest first performance prediction?",
    options: [
      {
        id: "A",
        text: "They must take exactly the same time because both execute the same number of source-level reads.",
        diagnosis: "SYSTEMS_SOURCE_OPERATION_COUNT_PROVES_COST",
        feedback:
          "Equal source-level read counts do not establish equal memory traffic, cache misses, or wall-clock time.",
      },
      {
        id: "B",
        text: "The randomized walk is always faster because it samples more of memory at once.",
        diagnosis: "SYSTEMS_RANDOM_ACCESS_IMPROVES_LOCALITY",
        feedback:
          "Random order usually makes reuse of adjacent bytes less likely; it does not create a general speed guarantee.",
      },
      {
        id: "C",
        text: "Address-order traversal may reuse bytes already fetched in a cache line, while random order may lose that locality; measure under a declared machine and workload.",
        diagnosis: null,
        feedback:
          "Correct. The logical result can agree while the memory-hierarchy evidence differs. The exact size of the effect remains an empirical claim.",
      },
      {
        id: "D",
        text: "Cache lines cannot matter to Python because the language hides physical addresses.",
        diagnosis: "SYSTEMS_LANGUAGE_ABSTRACTION_REMOVES_EXECUTION_LAYER",
        feedback:
          "Language abstraction changes what a program can directly name; it does not erase the execution stack beneath a concrete run.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "A cache transfers a nearby block, not one abstract source-level value. Sequential access can reuse a fetched line; random access can require more distinct line fills. A benchmark is still needed for a particular runtime and machine.",
    confidencePrompt:
      "Choose High only if you can separate the semantic output claim from the cache-locality performance hypothesis and name one measurement you would collect.",
    connection:
      "This layer discipline connects Python code reading to cache behavior, OS mediation, and later distributed performance evidence without pretending they are one mechanism.",
    route: {
      moduleNumber: 17,
      moduleTitle: "Computer Architecture and the Execution Stack",
      section: "Memory hierarchy, cache lines, and locality",
      href: "/modules/17-computer-architecture-execution-stack#6-memory-hierarchy-cache-lines-and-locality",
    },
  },
  {
    id: "quantifier-scope-countermodel",
    number: 15,
    arc: "VI",
    category: "Quantifier scope and countermodels",
    placementArea: "Discrete math and proof",
    foundationAreas: ["discrete-math"],
    prompt:
      "A recovery specification says: “For every request r, there exists a repair plan p that restores r's invariant.” A reviewer rewrites it as: “There exists one plan p that restores every request's invariant.” What is the best review?",
    options: [
      {
        id: "A",
        text: "The rewrite is equivalent because both sentences mention every request and a repair plan.",
        diagnosis: "PROOF_QUANTIFIER_WORDS_IGNORE_ORDER",
        feedback:
          "The same words do not preserve the same dependency structure. Quantifier order controls whether a plan may depend on the request.",
      },
      {
        id: "B",
        text: "The rewrite weakens the guarantee, so any implementation that satisfies the original automatically satisfies it.",
        diagnosis: "PROOF_QUANTIFIER_SWAP_WEAKENS_GUARANTEE",
        feedback:
          "A single universal plan is a stronger requirement, not a weaker one.",
      },
      {
        id: "C",
        text: "The rewrite strengthens the guarantee by reversing the dependency. Two requests that require incompatible plans form a countermodel to the rewrite while the original can still hold.",
        diagnosis: null,
        feedback:
          "Correct. In the original statement, p may depend on r. The rewritten claim requires one p to work for all r.",
      },
      {
        id: "D",
        text: "The rewrite is invalid only if the implementation uses recursion.",
        diagnosis: "PROOF_QUANTIFIER_SCOPE_DEPENDS_ON_IMPLEMENTATION_STYLE",
        feedback:
          "The distinction is logical and exists before choosing recursion, loops, or any implementation language.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "∀r ∃p P(r, p) allows a different witness p for each r. ∃p ∀r P(r, p) requires a common witness. The latter implies the former, but not conversely.",
    confidencePrompt:
      "Choose High only if you can give two concrete requests, name the incompatible plans, and say which statement each pair refutes or satisfies.",
    connection:
      "Quantifier order appears in API contracts, security policies, program specifications, complexity claims, and the assumptions hidden in agent-generated proofs.",
    route: {
      moduleNumber: 27,
      moduleTitle: "Discrete Mathematics, Proof, Counting & Structures",
      section: "Session 1 — Definitions, logic, and countermodels",
      href: "/modules/27-discrete-mathematics-proof-counting-structures#3-session-1--definitions-logic-and-countermodels",
    },
  },
  {
    id: "linear-algebra-basis-coordinates",
    number: 16,
    arc: "VI",
    category: "Bases, coordinates, and represented objects",
    placementArea: "Linear algebra and representation",
    foundationAreas: ["linear-algebra"],
    prompt:
      "In R², an object has coordinates (a, b) in the basis v₁ = (1, 0), v₂ = (0, 1). It is represented instead in the basis w₁ = (1, 0), w₂ = (1, 1). What are its coordinates in the w basis?",
    options: [
      {
        id: "A",
        text: "(a, b), because changing a basis never changes coordinates.",
        diagnosis: "LINEAR_ALGEBRA_OBJECT_EQUALS_COORDINATES",
        feedback:
          "The represented vector is unchanged, but its coordinate tuple depends on the chosen basis.",
      },
      {
        id: "B",
        text: "(a + b, b), because w₂ adds one to the first coordinate.",
        diagnosis: "LINEAR_ALGEBRA_BASIS_CHANGE_DIRECTION_REVERSED",
        feedback:
          "To reconstruct (a, b), the w coefficients must satisfy c + d = a and d = b, so the first coefficient is a − b.",
      },
      {
        id: "C",
        text: "(a − b, b), because c·w₁ + d·w₂ = (c + d, d) must equal (a, b).",
        diagnosis: null,
        feedback:
          "Correct. The object stays fixed while the coordinate convention changes; solving the representation equation yields c = a − b and d = b.",
      },
      {
        id: "D",
        text: "No coordinates exist because w₁ and w₂ are not orthogonal.",
        diagnosis: "LINEAR_ALGEBRA_ONLY_ORTHOGONAL_LISTS_ARE_BASES",
        feedback:
          "Orthogonality is useful but not required. The two w vectors are independent and span R², so they form a basis.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Coordinates are coefficients relative to a declared basis. With c(1, 0) + d(1, 1) = (a, b), the second coordinate gives d = b and the first gives c = a − b.",
    confidencePrompt:
      "Choose High only if you can reconstruct the vector from both coordinate systems and distinguish the vector from either coordinate tuple.",
    connection:
      "The same distinction protects representation work in embeddings, feature matrices, numerical software, and machine-learning pipelines.",
    route: {
      moduleNumber: 28,
      moduleTitle: "Linear Algebra, Numerical Stability & Representation",
      section: "Session 1 — Vectors, spaces, coordinates, rank, and lost directions",
      href: "/modules/28-linear-algebra-numerical-stability-representation#3-session-1--vectors-spaces-coordinates-rank-and-lost-directions",
    },
  },
  {
    id: "calculus-gradient-local-change",
    number: 17,
    arc: "VI",
    category: "Derivatives and local approximation",
    placementArea: "Calculus and continuous change",
    foundationAreas: ["calculus"],
    prompt:
      "For f(x) = x², f′(10) = 20. What does the derivative justify about changing x from 10 to 10.01?",
    options: [
      {
        id: "A",
        text: "The exact change in f is 0.20 because derivatives give exact finite changes.",
        diagnosis: "CALCULUS_DERIVATIVE_EQUALS_FINITE_CHANGE",
        feedback:
          "The actual change is 10.01² − 10² = 0.2001. The derivative supplies a local linear approximation, not exact finite change in general.",
      },
      {
        id: "B",
        text: "The change is approximately 20 × 0.01 = 0.20 locally; the quality of that approximation depends on the step and the function's local behavior.",
        diagnosis: null,
        feedback:
          "Correct. The derivative is the linear coefficient in a local approximation. It does not alone certify a global trend or an arbitrary step size.",
      },
      {
        id: "C",
        text: "f must increase by 0.20 for every positive change in x because the derivative at 10 is positive.",
        diagnosis: "CALCULUS_LOCAL_DERIVATIVE_PROVES_GLOBAL_BEHAVIOR",
        feedback:
          "A derivative at one point makes a local statement. Global behavior needs assumptions and evidence on a larger domain.",
      },
      {
        id: "D",
        text: "No conclusion is possible until an integral has been computed.",
        diagnosis: "CALCULUS_INTEGRAL_REQUIRED_FOR_LOCAL_LINEARIZATION",
        feedback:
          "A derivative already supports a first-order local approximation; an integral answers a different accumulation question.",
      },
    ],
    correctOptionId: "B",
    rationale:
      "Differentiability at 10 gives f(10 + h) = f(10) + 20h + o(h). For h = 0.01, 0.20 is a first-order estimate; the 0.0001 remainder is visible here because f is quadratic.",
    confidencePrompt:
      "Choose High only if you can state the local approximation, compute the exact remainder here, and explain why a derivative at one point does not prove a global claim.",
    connection:
      "This local-versus-global boundary is essential for numerical methods, sensitivity analysis, optimization, automatic differentiation, and learning-system reasoning.",
    route: {
      moduleNumber: 29,
      moduleTitle: "Calculus, Real Analysis & Continuous Change",
      section: "Session 2 — Derivatives, mean value, Taylor approximation, and finite differences",
      href: "/modules/29-calculus-real-analysis-continuous-change#4-session-2--derivatives-mean-value-taylor-approximation-and-finite-differences",
    },
  },
  {
    id: "probability-conditional-evidence",
    number: 18,
    arc: "VI",
    category: "Conditional evidence and base rates",
    placementArea: "Probability and scientific inference",
    foundationAreas: ["probability"],
    context:
      "A condition has base rate P(H) = 0.01. A test has P(+ | H) = 0.90 and P(+ | not H) = 0.05.",
    prompt:
      "Before computing P(H | +), what must the denominator represent?",
    options: [
      {
        id: "A",
        text: "P(H), because the question is about the condition.",
        diagnosis: "PROBABILITY_POSTERIOR_DENOMINATOR_IS_PRIOR",
        feedback:
          "The posterior conditions on a positive result, so its denominator must account for the probability of that observed positive result.",
      },
      {
        id: "B",
        text: "P(+ | H), because the test is positive.",
        diagnosis: "PROBABILITY_LIKELIHOOD_IS_EVIDENCE_MARGINAL",
        feedback:
          "The likelihood describes positives among cases with H; it does not include false positives among cases without H.",
      },
      {
        id: "C",
        text: "P(+): the total probability of a positive result across H and not H, computed from the declared base rate and both conditional rates.",
        diagnosis: null,
        feedback:
          "Correct. Bayes' rule conditions on the evidence actually observed, so the denominator is the marginal probability of + in the same declared model.",
      },
      {
        id: "D",
        text: "No denominator is needed; a positive result makes H 90% likely.",
        diagnosis: "PROBABILITY_LIKELIHOOD_EQUALS_POSTERIOR",
        feedback:
          "P(+ | H) and P(H | +) reverse the condition. With a low base rate and false positives, they can differ dramatically.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "Bayes' rule is P(H | +) = P(+ | H)P(H) / P(+). Here P(+) must include positives from both H and not H under the declared model.",
    confidencePrompt:
      "Choose High only if you can draw the two branches H and not H, compute P(+), and name the conditioning direction in every term.",
    connection:
      "This model discipline transfers to diagnostic tests, alerts, classifiers, Bayesian updates, uncertainty claims, and AI-system evaluation.",
    route: {
      moduleNumber: 30,
      moduleTitle: "Probability, Statistics & Scientific Inference",
      section: "Session 1 — From a story to a probability model",
      href: "/modules/30-probability-statistics-scientific-inference#3-session-1--from-a-story-to-a-probability-model",
    },
  },
  {
    id: "optimization-feasible-descent",
    number: 19,
    arc: "VI",
    category: "Objectives, constraints, and feasible updates",
    placementArea: "Optimization foundations",
    foundationAreas: ["optimization", "calculus", "linear-algebra"],
    prompt:
      "An optimizer minimizes f(x) = x² subject to x ≥ 1 and starts at x = 1. An agent proposes the unconstrained gradient step x ← x − 1·(2x), which gives x = −1. What must block acceptance?",
    options: [
      {
        id: "A",
        text: "Nothing; the objective decreased, so the proposed point is automatically valid.",
        diagnosis: "OPTIMIZATION_OBJECTIVE_DECREASE_PROVES_FEASIBILITY",
        feedback:
          "A lower unconstrained objective does not satisfy the stated feasible-set contract. The candidate x = −1 violates x ≥ 1.",
      },
      {
        id: "B",
        text: "The gradient must be wrong because a minimum can never have a nonzero gradient.",
        diagnosis: "OPTIMIZATION_CONSTRAINED_MINIMUM_REQUIRES_ZERO_GRADIENT",
        feedback:
          "For constrained optima, boundary geometry and constraint conditions matter; an unconstrained zero-gradient rule is insufficient.",
      },
      {
        id: "C",
        text: "The step violates feasibility. State the objective and constraint, then use a feasible method or justify an appropriate projection/constraint condition before interpreting progress.",
        diagnosis: null,
        feedback:
          "Correct. An optimizer step is not evidence by itself: its objective, feasible set, update rule, and stopping or convergence claim all need explicit contracts.",
      },
      {
        id: "D",
        text: "Increase the step size until the next point is positive; no other reasoning is needed.",
        diagnosis: "OPTIMIZATION_STEP_SIZE_REPLACES_CONSTRAINT_MODEL",
        feedback:
          "Changing a parameter does not supply a feasibility mechanism or establish what the update represents.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "The unconstrained gradient at x = 1 is 2, but the proposed point −1 lies outside the feasible set. A constrained problem requires an update and interpretation that preserve or explicitly handle the constraint.",
    confidencePrompt:
      "Choose High only if you can name the objective, feasible set, proposed update, violated condition, and one legal repair such as projection or a constrained optimality argument.",
    connection:
      "Optimization turns calculus and linear-algebra models into algorithms. In the AI era, reviewing the declared objective and constraints matters more than accepting a plausible optimizer trace.",
    route: {
      moduleNumber: 29,
      moduleTitle: "Calculus, Real Analysis & Continuous Change",
      section: "Session 6 — Constrained extrema, ODE approximation, and the continuous-change dossier",
      href: "/modules/29-calculus-real-analysis-continuous-change#8-session-6--constrained-extrema-ode-approximation-and-the-continuous-change-dossier",
    },
  },
  {
    id: "ml-evaluation-leakage",
    number: 20,
    arc: "VI",
    category: "ML evaluation boundaries and leakage",
    placementArea: "AI/ML reasoning foundations",
    foundationAreas: ["ai-ml", "probability", "systems"],
    prompt:
      "A model predicts hospital readmission. The data contain multiple timestamped records per patient, and a random record-level train/test split places some patients in both sets. The test score is high. What is the strongest review?",
    options: [
      {
        id: "A",
        text: "Accept the score: a random split is always unbiased when there are many rows.",
        diagnosis: "ML_RANDOM_ROWS_ALWAYS_PROVE_GENERALIZATION",
        feedback:
          "Row count does not remove dependency or identity overlap. The test set can contain information too close to the training records to support the intended deployment claim.",
      },
      {
        id: "B",
        text: "Remove the patient ID column and accept the score, because leakage can occur only through an explicit identifier feature.",
        diagnosis: "ML_LEAKAGE_REQUIRES_EXPLICIT_ID_FEATURE",
        feedback:
          "Leakage can arise from split construction, timestamps, duplicated observations, preprocessing, labels, or correlated records—not only a visible ID column.",
      },
      {
        id: "C",
        text: "The split may leak patient-specific or future information. Define the deployment target, split by patient and/or time as appropriate, then report the resulting uncertainty and error analysis.",
        diagnosis: null,
        feedback:
          "Correct. Evaluation evidence must match the prediction target and information available at deployment; a high score on a contaminated split is not a generalization guarantee.",
      },
      {
        id: "D",
        text: "Increase model size until the test score stays high across more random splits.",
        diagnosis: "ML_CAPACITY_REPAIRS_EVALUATION_BOUNDARY",
        feedback:
          "More capacity cannot repair a mismatched evaluation boundary and may amplify a shortcut learned from leakage.",
      },
    ],
    correctOptionId: "C",
    rationale:
      "A test split is evidence only for the data-generating and deployment relationship it preserves. Patient or temporal overlap can let a model exploit non-deployable information, so the target, split, uncertainty, and failure analysis must be explicit.",
    confidencePrompt:
      "Choose High only if you can state the intended deployment moment, name one leakage path in this split, and propose a split that blocks it without claiming it proves universal generalization.",
    connection:
      "This is the bridge from probability and data provenance to trustworthy model evaluation, agent review, and the later ML extension—without treating a metric as proof.",
    route: {
      moduleNumber: 30,
      moduleTitle: "Probability, Statistics & Scientific Inference",
      section: "Session 6 — Design, criticism, missingness, robustness, and dimension",
      href: "/modules/30-probability-statistics-scientific-inference#8-session-6--design-criticism-missingness-robustness-and-dimension",
    },
  },
];

const questionById = new Map(
  diagnosticQuestions.map((question) => [question.id, question]),
);
const foundationAreaById = new Map(
  requiredFoundationAreas.map((area) => [area.id, area]),
);
const foundationAreaOrder = new Map(
  requiredFoundationAreas.map((area, index) => [area.id, index]),
);
const courseModuleByNumber = new Map(
  courseGraph.modules.map((courseModule) => [courseModule.number, courseModule]),
);
const canonicalRouteModuleNumbers =
  courseGraph.routePlans
    .find(({ id }) => id === "atlas-core-60")
    ?.phases.flatMap(({ moduleNumbers }) => moduleNumbers) ?? [];
const canonicalRouteRank = new Map(
  canonicalRouteModuleNumbers.map((moduleNumber, index) => [
    moduleNumber,
    index,
  ]),
);
const openDiagnosticRouteModuleNumbers = new Set(
  courseGraph.modules
    .filter(
      ({ state }) =>
        ["legacy-open", "published"].includes(state.availability) &&
        state.readerAccess === "full",
    )
    .map(({ number }) => number),
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
 * Keep every diagnostic route connected to the canonical graph. This is
 * deliberate metadata for display and handoff, not a claim that a direct
 * module link waives its academic prerequisites.
 *
 * @param {DiagnosticRoute} route
 * @returns {ResolvedDiagnosticRoute}
 */
function resolveDiagnosticRoute(route) {
  const courseModule = courseModuleByNumber.get(route.moduleNumber);
  const academicPrerequisites = (courseModule?.academicPrerequisiteNumbers ?? [])
    .map((moduleNumber) => courseModuleByNumber.get(moduleNumber))
    .filter((courseModule) => courseModule !== undefined)
    .map((courseModule) => ({
      moduleNumber: courseModule.number,
      moduleTitle: courseModule.title,
      availability: courseModule.state.availability,
      lifecycle: courseModule.state.lifecycle,
      readerAccess: courseModule.state.readerAccess,
    }));

  return {
    ...route,
    academicPrerequisites,
  };
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
        ...resolveDiagnosticRoute(signal.question.route),
        priority: signal.priority,
        tier: signal.tier,
        questionNumber: signal.question.number,
        category: signal.question.category,
      });
    }
  }
  const learningRoute = [...routeByHref.values()].sort(
    (left, right) =>
      (canonicalRouteRank.get(left.moduleNumber) ?? Number.MAX_SAFE_INTEGER) -
        (canonicalRouteRank.get(right.moduleNumber) ?? Number.MAX_SAFE_INTEGER) ||
      left.priority - right.priority ||
      left.questionNumber - right.questionNumber,
  );

  const bridgeByAreaId = new Map();
  for (const signal of prioritySignals.filter((item) => item.tier !== "ready")) {
    for (const areaId of signal.question.foundationAreas) {
      const area = foundationAreaById.get(areaId);
      if (!area) {
        continue;
      }
      const existing = bridgeByAreaId.get(area.id);
      if (
        !existing ||
        signal.priority < existing.priority ||
        (signal.priority === existing.priority &&
          signal.question.number < existing.questionNumber)
      ) {
        bridgeByAreaId.set(area.id, {
          area,
          route: resolveDiagnosticRoute(signal.question.route),
          tier: signal.tier,
          priority: signal.priority,
          questionNumber: signal.question.number,
          questionCategory: signal.question.category,
          extension: area.extension,
        });
      }
    }
  }
  const bridgeRecommendations = [...bridgeByAreaId.values()].sort(
    (left, right) =>
      (foundationAreaOrder.get(left.area.id) ?? Number.MAX_SAFE_INTEGER) -
      (foundationAreaOrder.get(right.area.id) ?? Number.MAX_SAFE_INTEGER),
  );

  return {
    questionCount: diagnosticQuestions.length,
    answeredCount: signals.length,
    correctCount: signals.filter((signal) => signal.correct).length,
    byTier,
    prioritySignals,
    learningRoute,
    bridgeRecommendations,
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

  lines.push("", "Connected repair queue (inside the canonical route):");
  if (result.learningRoute.length === 0) {
    lines.push(
      "Instructor transfer interview first; no section was automatically skipped.",
    );
  } else {
    for (const [index, route] of result.learningRoute.entries()) {
      lines.push(
        `${index + 1}. Module ${route.moduleNumber} — ${route.section}: ${route.href}` +
          formatAcademicPrerequisiteNote(route),
      );
    }
  }

  lines.push("", "Foundation bridge recommendations:");
  if (result.bridgeRecommendations.length === 0) {
    lines.push(
      "No automatic foundation repair route. Use an instructor transfer conversation before compressing instruction.",
    );
  } else {
    for (const recommendation of result.bridgeRecommendations) {
      lines.push(
        `- ${recommendation.area.label}: Q${String(recommendation.questionNumber).padStart(2, "0")} → open Module ${recommendation.route.moduleNumber} — ${recommendation.route.section}: ${recommendation.route.href}` +
          formatAcademicPrerequisiteNote(recommendation.route) +
          (recommendation.extension
            ? ` | Future Module ${recommendation.extension.moduleNumber} (${recommendation.extension.title}) remains ${recommendation.extension.status}; it is not a route.`
            : ""),
      );
    }
  }

  lines.push(
    "",
    "Instructor note: treat these as hypotheses. Verify with explanation, code tracing, and transfer before compressing any module.",
  );
  return lines.join("\n");
}

/**
 * @param {ResolvedDiagnosticRoute} route
 */
function formatAcademicPrerequisiteNote(route) {
  if (route.academicPrerequisites.length === 0) {
    return "";
  }
  const label =
    route.academicPrerequisites.length === 1
      ? "Direct prerequisite"
      : "Direct prerequisites";
  const modules = route.academicPrerequisites
    .map((prerequisite) =>
      `Module ${prerequisite.moduleNumber} (${prerequisite.moduleTitle})`,
    )
    .join(", ");
  return ` | ${label}: ${modules}. This link does not waive them.`;
}

export function validateDiagnosticDefinition() {
  const errors = [];
  const questionIds = new Set();
  const foundationAreaIds = new Set();
  for (const area of requiredFoundationAreas) {
    if (foundationAreaIds.has(area.id)) {
      errors.push(`Duplicate foundation area id: ${area.id}`);
    }
    foundationAreaIds.add(area.id);
    const probe = questionById.get(area.probeQuestionId);
    if (!probe) {
      errors.push(`${area.id} needs a known probe question`);
    } else if (!probe.foundationAreas.includes(area.id)) {
      errors.push(`${area.id} probe must declare its foundation area`);
    }
    if (area.extension) {
      if (
        area.extension.status !== "authoring-only" ||
        !Number.isInteger(area.extension.moduleNumber) ||
        area.extension.moduleNumber < 31
      ) {
        errors.push(`${area.id} has an invalid advanced-extension boundary`);
      }
      if (Object.hasOwn(area.extension, "href")) {
        errors.push(`${area.id} advanced extension must not expose an href`);
      }
    }
  }
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
    if (!openDiagnosticRouteModuleNumbers.has(question.route.moduleNumber)) {
      errors.push(`${question.id} must route only to an open foundation`);
    }
    const routeModule = courseModuleByNumber.get(question.route.moduleNumber);
    if (!routeModule) {
      errors.push(`${question.id} must route to a known graph module`);
    } else if (!canonicalRouteRank.has(routeModule.number)) {
      errors.push(`${question.id} route must appear in the canonical route plan`);
    }
    if (
      question.foundationAreas.length === 0 ||
      new Set(question.foundationAreas).size !== question.foundationAreas.length
    ) {
      errors.push(`${question.id} needs distinct foundation areas`);
    }
    for (const areaId of question.foundationAreas) {
      if (!foundationAreaById.has(areaId)) {
        errors.push(`${question.id} has an unknown foundation area: ${areaId}`);
      }
    }
  }
  return errors;
}
