/**
 * The complete, bounded set of bench packs that actually exist on disk.
 *
 * A bench is an executable file bound to exactly one teaching session, emitting
 * exactly one artifact — the one that session's workbook already declares under
 * its `### Output:` heading. A *lab* lives inside a document; a *bench* is an
 * executable file outside it.
 *
 * Like `module-bench-registry`'s sibling `module-studio-registry`, a graph
 * declaration outside this set is a configuration error, never an invitation to
 * guess a path from a module slug. Unlike the studio registry this is plain
 * `.mjs`, following `evidence-label-taxonomy.mjs`, because the validators are
 * Node scripts and must read the same source of truth the portal does.
 *
 * `emitsArtifact` is the load-bearing field. `validate-benches.mjs`
 * string-compares it against the generated `workbookOutput` for that session, so
 * a bench cannot quietly redefine what its session produces.
 */

/** The canonical eight, from COURSE_PRODUCTION_STANDARD.md. Order is the ladder. */
export const ladderRungs = Object.freeze([
  "recognize",
  "trace",
  "map",
  "modify",
  "debug-and-defend",
  "design-and-delegate",
  "review-and-verify",
  "transfer",
]);

/**
 * Third-party imports a bench may declare. Bounded so the CI install stays
 * deterministic, in the spirit of `release-input-policy.v1.json`.
 */
export const benchDependencyAllowlist = Object.freeze(["numpy", "matplotlib", "sympy"]);

/** Bench floors we are willing to support. CI's matrix is 3.12 and 3.14. */
export const benchPythonFloors = Object.freeze(["3.12", "3.13", "3.14"]);

/**
 * Why a session has no bench. An absence must be a stated decision, not a gap —
 * the same epistemic move the course teaches about evidence.
 */
export const noBenchReasons = Object.freeze({
  A1: "the artifact is prose, design, threat modelling, or oral defence",
  A2: "needs real processes, sockets, filesystems, privilege, or a device queue — a kernel would model it dishonestly",
  A3: "a synthesis or dossier consuming earlier sessions rather than producing new evidence",
  A4: "would only re-execute what the workbook already prints",
  // Distinct from A1–A4 on purpose. Those say a bench here would be noise; this
  // says a bench here would be fine and we chose three. Collapsing the two would
  // let a real exclusion hide behind a budget decision, and would lose the list
  // of sessions worth revisiting if a pack is ever widened.
  CUT: "qualifies on the rubric but ranked below this pack's cut; sparse packs cap at three",
});

/**
 * Most packs are `sparse`: 2–3 benches covering the sessions where running code
 * reveals something reading cannot. `dense` marks the two packs authored before
 * the sparse policy existed — they are kept because they are written and
 * verified, not because six is a target.
 */
export const benchPackPolicies = Object.freeze(["sparse", "dense"]);

/**
 * Every session in a registered pack must be accounted for in exactly one of
 * three states: it has a bench, it is deliberately excluded with a reason code,
 * or it is `plannedSessions` — selected but not yet authored.
 *
 * The third state exists so a half-built pack cannot be made to look finished.
 * Without it, authoring one bench of three would force the other two to be
 * declared permanently excluded, and the registry would then assert a
 * pedagogical decision that was never made.
 */
export const benchSessionStates = Object.freeze(["benched", "excluded", "planned"]);

/**
 * R2' — the corpus-level weight floor. Under sparse packs a per-pack rule cannot
 * work: a 2-bench pack cannot carry both heavy rungs. But the evidence weights
 * in AI_NATIVE_LEARNING_MODEL.md are corpus proportions anyway — debugging is
 * 20% and agent-directed review is 20% of what the course assesses, not 20% of
 * every module.
 */
export const corpusRungFloors = Object.freeze({
  "debug-and-defend": 0.15,
  "review-and-verify": 0.15,
});

/**
 * The other half of R2'. Targeted mechanism implementation is 5% of the
 * course's assessed evidence, and R1 alone cannot hold that: R1 permits one
 * modify-primary bench per pack, so 35 sparse packs could reach 37% while
 * every pack individually obeys the rule. The ceiling is what actually
 * enforces the weight.
 *
 * Set at 10% rather than 5% because a 2-bench pack cannot express 5%.
 */
export const corpusRungCeilings = Object.freeze({
  modify: 0.1,
});

/**
 * Below this many benches a corpus proportion is noise, not a measurement —
 * the same reason `classify_growth` refuses a verdict on two data points. The
 * two packs authored before the sparse policy are 12 benches and would trip a
 * modify ceiling that a full corpus comfortably clears.
 */
export const corpusRuleMinimumBenches = 20;

export const benchPackRegistry = Object.freeze({
  m01: {
    benchPackId: "m01",
    moduleNumber: 1,
    title: "Values, state, and execution bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "bc2479dbda5330fb7b38fdd08d07d92ab42f1cb0a12f3fb12bc432d7cd4c6990",
        sourcePath: "benches/src/m01/s2_environment_trace_and_scope_claim.py",
        emitsArtifact: "environment trace and scope claim",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "9a35561f92d1c391740d005661830b42b881ca0932c3edd82aac0206d9c0f65e",
        sourcePath: "benches/src/m01/s3_ownership_contract_card.py",
        emitsArtifact: "ownership contract card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "3747b4b2f9eaccc04d946a82daaa7db3124d2a4ba88963cbe7f3e934275bf33a",
        sourcePath: "benches/src/m01/s4_event_log_comparison_and_repair_memo.py",
        emitsArtifact: "event-log comparison and repair memo",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      { sessionNumber: 5, reason: "A1" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m02: {
    benchPackId: "m02",
    moduleNumber: 2,
    title: "Functions, recursion, and induction bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "a156fd14e921b9d46c046cedc44d6366ee7172cad7dbade0fc2b5092cc1d8bab",
        sourcePath: "benches/src/m02/s3_termination_and_induction_proof_note.py",
        emitsArtifact: "termination-and-induction proof note",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "71134055ee2cf6bc92ee5c536711a272660be5033afaf78ae7a60702801a1829",
        sourcePath: "benches/src/m02/s4_recurrence_and_stack_cost_claim.py",
        emitsArtifact: "recurrence-and-stack-cost claim",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "56821675939081d600956ab654ac41e5e9fae9926272e8e37c0938d11aadef94",
        sourcePath: "benches/src/m02/s5_recursive_failure_investigation_memo.py",
        emitsArtifact: "recursive-failure-investigation memo",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      { sessionNumber: 2, reason: "A4" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m03: {
    benchPackId: "m03",
    moduleNumber: 3,
    title: "Abstraction, interfaces, and ADTs bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "a8e27f9fed3c21c80722b2e2fda2c958857168914d97825a1406cc0ee1aeaf2a",
        sourcePath: "benches/src/m03/s3_af_ri_correspondence_table.py",
        emitsArtifact: "AF/RI correspondence table",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "cdd6a337931f36f27a6f3096f7bb51a546e546bf391dc00525620e94c5431052",
        sourcePath: "benches/src/m03/s4_structural_shape_versus_behavioral_law_trace.py",
        emitsArtifact: "structural-shape versus behavioral-law trace",
        rungs: ["review-and-verify", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "7258b2ec09b1dd03c16acd599382543c2f56e72c4de8da8ab475e6e80f1ac11c",
        sourcePath: "benches/src/m03/s5_architecture_and_invariant_repair_note.py",
        emitsArtifact: "architecture and invariant repair note",
        rungs: ["debug-and-defend", "map"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      { sessionNumber: 2, reason: "A1" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m04: {
    benchPackId: "m04",
    moduleNumber: 4,
    title: "Logic, sets, relations, graphs, and proof bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "fe529bd9073e8ccbeb082b254c37450aac9f1a64b481f933eef5c75153d96e95",
        sourcePath: "benches/src/m04/s3_prerequisite_graph_and_cycle_witness.py",
        emitsArtifact: "prerequisite-graph and cycle witness",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "9f0a65e0f15be8dbb51b9db770188ea395355900825f61b33f12fe9baa4808a6",
        sourcePath: "benches/src/m04/s4_proof_and_probability_boundary_note.py",
        emitsArtifact: "proof-and-probability boundary note",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 2, reason: "A1" },
      // The three-implementations-one-verdict experiment is already benched at
      // m01-s4 and m03-s4; running it a third time would violate R3'.
      { sessionNumber: 5, reason: "A4" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m05: {
    benchPackId: "m05",
    moduleNumber: 5,
    title: "Cost models and algorithm analysis bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    // Authored before the sparse policy existed. Kept because it is written and
    // verified; six is not a target for later packs.
    policy: "dense",
    unbenchedSessions: [],
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "783ba47df81409d16c8faf81fac24bce0a3421c09ed53026dbeb48e6d30c5943",
        sourcePath: "benches/src/m05/s1_cost_model_card.py",
        emitsArtifact: "explicit cost-model card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 2,
        sessionSha256: "898d482acc7cc1960149fb442f1e5e5b4b3fccd6fcf5c326ac678d7afd01d9e3",
        sourcePath: "benches/src/m05/s2_bound_and_case_claim.py",
        emitsArtifact: "bound-and-case claim",
        rungs: ["recognize", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "cab77ae529a8d2f00c1f8b72059bc04ddd8e720f3e88c8a6df7824e2e1cb4082",
        sourcePath: "benches/src/m05/s3_recurrence_and_recursion_tree_trace.py",
        emitsArtifact: "recurrence and recursion-tree trace",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "39e9c85a92e60b39f658eb57a9cc3de9a5087695c46c3e70c9858ce1a45bb6b6",
        sourcePath: "benches/src/m05/s4_amortized_and_space_account.py",
        emitsArtifact: "amortized and space account",
        rungs: ["modify", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "3e8fe62188511611cd48c4e61c6192ffc0bd6222db4574981eb2a83520d6d25a",
        sourcePath: "benches/src/m05/s5_measurement_boundary_report.py",
        emitsArtifact: "measurement-boundary report",
        rungs: ["debug-and-defend", "trace"],
        dependencies: ["matplotlib"],
      },
      {
        sessionNumber: 6,
        sessionSha256: "09feb31dfcbbe5a92b450133a9e1d607814cf310d8d556f88ac211a6a383f185",
        sourcePath: "benches/src/m05/s6_representation_decision_dossier.py",
        emitsArtifact: "representation decision dossier",
        rungs: ["review-and-verify", "design-and-delegate", "transfer"],
        dependencies: [],
      },
    ],
  },
  m06: {
    benchPackId: "m06",
    moduleNumber: 6,
    title: "Representation, memory, and sequences bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "63000caf9f52272af33ed7b3494177d94b7354a27aa0a981db3d23c491521082",
        sourcePath: "benches/src/m06/s3_growth_and_capacity_evidence_card.py",
        emitsArtifact: "growth-and-capacity evidence card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "b19d901a61801623e77db5310c3381f934fc8cb2f9e406c03c65ea4efe15fcbe",
        sourcePath: "benches/src/m06/s4_linked_invariant_and_boundary_transition_trace.py",
        emitsArtifact: "linked-invariant and boundary-transition trace",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "ef3c6619542d6e2ee33917dbc6b2de13e8ead982cbd91666f440cf9207bc1324",
        sourcePath: "benches/src/m06/s5_memory_scope_and_architecture_memo.py",
        emitsArtifact: "memory-scope and architecture memo",
        rungs: ["trace", "map"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A4" },
      { sessionNumber: 2, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m07: {
    benchPackId: "m07",
    moduleNumber: 7,
    title: "Stacks, queues, iteration, and lazy computation bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "79d636d73b374aa5dde68f44a1ab894ccbba5428face10cdd2135cf675bcb9cd",
        sourcePath: "benches/src/m07/s2_iterator_state_trace.py",
        emitsArtifact: "iterator-state trace",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "509c5651d2d10eca09cfbaee05122f283bf7369696d1eb7dc09127933c960b51",
        sourcePath: "benches/src/m07/s3_generator_suspension_trace.py",
        emitsArtifact: "generator-suspension trace",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "186e293e1c14d20d67926e57f3832543e5c46e293224a6ad2727e41ae91b83fc",
        sourcePath: "benches/src/m07/s4_demand_and_ownership_map.py",
        emitsArtifact: "demand-and-ownership map",
        rungs: ["debug-and-defend", "map"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m08: {
    benchPackId: "m08",
    moduleNumber: 8,
    title: "Hashing, dictionaries, sets, and indexing bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "83a2f3f53ed009646bd3dfa2d0c3757648e4d9d2e9292b54957c99fa1c0418a3",
        sourcePath: "benches/src/m08/s2_collision_and_equality_trace.py",
        emitsArtifact: "collision-and-equality trace",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "9d373d65608d0d6c5553a9dda1e3c1fab3d5cf3dd6aaa6df0fffdcba0e0788d8",
        sourcePath: "benches/src/m08/s3_key_contract_repair_note.py",
        emitsArtifact: "key-contract repair note",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "6ac32f8282bf144718d507f89d89c62bb319c9d912d772fa4777e8c1942fd5f1",
        sourcePath: "benches/src/m08/s4_qualified_cost_card.py",
        emitsArtifact: "qualified-cost card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 5, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m09: {
    benchPackId: "m09",
    moduleNumber: 9,
    title: "Trees, heaps, sorting, and ordered search bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "dense",
    unbenchedSessions: [],
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "11ff51c62cf64e4e695faa996ef88799833277f58e02ae92c1972fd09496f542",
        sourcePath: "benches/src/m09/s1_ordered_operation_decision_ledger.py",
        emitsArtifact: "ordered-operation decision ledger",
        rungs: ["recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 2,
        sessionSha256: "7da51a0c7bd50e0aa8b60d34891a4002869e8228a2de10751c93a046b6f863d8",
        sourcePath: "benches/src/m09/s2_bst_path_and_proof_trace.py",
        emitsArtifact: "BST path-and-proof trace",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "bde161ca852425b889f22f9d3c25a3d09c50c19b71c48c5dacb48ef86db9e4e0",
        sourcePath: "benches/src/m09/s3_rotation_preservation_dossier.py",
        emitsArtifact: "rotation-preservation dossier",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "acfa2cf2a98620bf4ca3015082e05cd6b6a3c74123db9bae931aef5ebb75cc78",
        sourcePath: "benches/src/m09/s4_heap_invariant_trace.py",
        emitsArtifact: "heap invariant trace",
        rungs: ["modify", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "03fd631f4b9176120a35a8e53c36f62d29367325c9fac9551eddfd3735e96dca",
        sourcePath: "benches/src/m09/s5_ordering_contract_comparison_memo.py",
        emitsArtifact: "ordering-contract comparison memo",
        rungs: ["review-and-verify", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 6,
        sessionSha256: "26f33c73b008217a7a0e065736df8cd7d86fee489d1877f977cbfd6b98389916",
        sourcePath: "benches/src/m09/s6_ordered_index_defense_dossier.py",
        emitsArtifact: "ordered-index defense dossier",
        rungs: ["design-and-delegate", "transfer"],
        dependencies: [],
      },
    ],
  },
  m10: {
    benchPackId: "m10",
    moduleNumber: 10,
    title: "Graph algorithms and network models bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "512283b903c34318487d2793ebbf0e252bf91ac81c9720ac665b05c58f659e1e",
        sourcePath: "benches/src/m10/s2_bfs_witness_and_cost_card.py",
        emitsArtifact: "BFS witness-and-cost card",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "119cbe61314a901903e9e861ab693b5647fda87ac8af0eca80aff3d7b3675965",
        sourcePath: "benches/src/m10/s3_dfs_cycle_or_order_evidence_card.py",
        emitsArtifact: "DFS cycle-or-order evidence card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "4d69dbfc4bae685ec194c636b7e7ff6d8dd904434e00c26135f6bdb4d5bc9c83",
        sourcePath: "benches/src/m10/s5_dijkstra_review_card.py",
        emitsArtifact: "Dijkstra review card",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 4, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m11: {
    benchPackId: "m11",
    moduleNumber: 11,
    title: "Algorithm design paradigms bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "790deb7109f1cf262be7c3bb1179f3bca5040bd51646f4356d2bc02b8c956333",
        sourcePath: "benches/src/m11/s2_strategy_proof_and_counterexample_card.py",
        emitsArtifact: "strategy proof and counterexample card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "4a65393924df3b36726706a368cb5afd2a4fd9988cea08f7f744e232abed3b90",
        sourcePath: "benches/src/m11/s4_pruning_and_state_sufficiency_proof.py",
        emitsArtifact: "pruning and state-sufficiency proof",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "af39628ec93389217ae9fed87e6cc7d0485880054ade1d6be01b5b13aa7cbad3",
        sourcePath: "benches/src/m11/s5_probability_and_quality_bound_ledger.py",
        emitsArtifact: "probability and quality-bound ledger",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      // Session 1's exhaustive oracle is folded into bench 4, where the prune
      // sweep uses it; running it separately would be the same experiment.
      { sessionNumber: 1, reason: "A4" },
      { sessionNumber: 3, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m12: {
    benchPackId: "m12",
    moduleNumber: 12,
    title: "Modules, APIs, types, dependencies bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "9b328b6499201181cb91bf7b65d0c286087cb54760522b3803ff3d9b1b72662b",
        sourcePath: "benches/src/m12/s1_import_execution_and_dependency_trace.py",
        emitsArtifact: "import execution and dependency trace",
        rungs: ["trace", "debug-and-defend"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "9e508447d60509b55937171f01919cfd6c435b57d43255145ce13d29bda2b4ca",
        sourcePath: "benches/src/m12/s4_client_owned_port_map.py",
        emitsArtifact: "client-owned port map",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 6,
        sessionSha256: "b49a932997311ba520d4cce67c7d0acb7faecea81e090006314765441f74126d",
        sourcePath: "benches/src/m12/s6_architecture_review_dossier.py",
        emitsArtifact: "architecture review dossier",
        rungs: ["review-and-verify", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 2, reason: "CUT" },
      // Session 3's subject is static type relationships — narrowing, generics,
      // variance. A type checker decides those before the code runs; a kernel
      // that executes the code observes only what survives erasure, which is the
      // wrong instrument for the question.
      { sessionNumber: 3, reason: "A2" },
      // Session 5 is plugin discovery and trust: entry points, third-party
      // packages, and whether loading one is safe.
      { sessionNumber: 5, reason: "A2" },
    ],
  },
  m13: {
    benchPackId: "m13",
    moduleNumber: 13,
    title: "Specifications, testing, debugging, observability bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "52c5ab9f63b2c8bb169d41dc5e795173cbdd05e1a4bfd5fb4b94e2810fa427d7",
        sourcePath: "benches/src/m13/s2_claim_to_test_matrix.py",
        emitsArtifact: "M13 claim-to-test matrix",
        rungs: ["review-and-verify", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "f566523d3b89037e12fb1e9919095aa4e86ad5e502fff9172a4fa583886c503d",
        sourcePath: "benches/src/m13/s3_provider_contract_suite_and_double_rationale.py",
        emitsArtifact: "M13 provider-contract suite and double rationale",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "e8afa171eb95486a7bf09d713c251d15aad68a3fc42ffb6b067acd6cf30970c3",
        sourcePath: "benches/src/m13/s4_failure_dossier_and_regression_claim.py",
        emitsArtifact: "M13 failure dossier and regression claim",
        rungs: ["trace", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      // Session 1 turns an ambiguous request into a behavioural contract. The
      // artifact is the contract; running code cannot check whether ambiguity
      // was resolved well.
      { sessionNumber: 1, reason: "A1" },
      // Session 5 is production observability: sampling, rate and cost models,
      // and a privacy boundary. It needs a running service and real traffic.
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m14: {
    benchPackId: "m14",
    moduleNumber: 14,
    title: "Software design and change bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "f16807d15ca86bb8ce442e2c96d8bbb66652e32bcc341dc63e4586db039ef57d",
        sourcePath: "benches/src/m14/s3_state_failure_and_retry_boundary.py",
        emitsArtifact: "state, failure, and retry boundary",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "cef559a5ff5f01fed13513b21fb2f42966b9a2b04992a77b1eb029a441358f3e",
        sourcePath: "benches/src/m14/s5_evidence_led_review_and_bisect_predicate.py",
        emitsArtifact: "evidence-led review and bisect predicate",
        rungs: ["review-and-verify", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 2, reason: "A1" },
      // Session 4 stages a refactor in the Git graph — real commits, branches,
      // and a working tree this bench pack does not own.
      { sessionNumber: 4, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m15: {
    benchPackId: "m15",
    moduleNumber: 15,
    title: "Files, serialization, packaging, delivery bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "5eb426a29f6cba5a865da225bf5c6decf0d9f2ad07b9086eb48e5d82722756b2",
        sourcePath: "benches/src/m15/s1_representation_boundary_trace.py",
        emitsArtifact: "representation boundary trace",
        rungs: ["trace", "debug-and-defend"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "b13f57ae41a36090db5e96fa1673279a52ebdf4ba9e9842d9a2296f84eaf9a0f",
        sourcePath: "benches/src/m15/s3_schema_migration_and_trust_contract.py",
        emitsArtifact: "schema migration and trust contract",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      // Session 2 is resource lifetime across a publication failure: open handles,
      // partial writes, and crash timing that this process cannot inflict on
      // itself honestly.
      { sessionNumber: 2, reason: "A2" },
      { sessionNumber: 4, reason: "CUT" },
      // Session 5 is packaging and delivery — building, signing, and shipping an
      // artifact, which needs a real toolchain and a real distribution channel.
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m16: {
    benchPackId: "m16",
    moduleNumber: 16,
    title: "Relational data and transactions bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "eec9e348036d0755fbb0da1690003b780c2c3203d52a0623a478f9fffbb28c8c",
        sourcePath: "benches/src/m16/s2_constraint_and_repository_contract.py",
        emitsArtifact: "constraint and repository contract",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "5e5bd9cd3f0565c2c652217dc84af95c126b496466b57613bdf7aefec2e26a7e",
        sourcePath: "benches/src/m16/s3_result_contract_and_query_reasoning.py",
        emitsArtifact: "result contract and query reasoning",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "94d9a9053df74c56e0a679eb7359598f8e803101df7a511d49a085760df17575",
        sourcePath: "benches/src/m16/s5_transaction_schedule_and_retry_boundary.py",
        emitsArtifact: "transaction schedule and retry boundary",
        rungs: ["review-and-verify", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      // Session 4 measures query plans. EXPLAIN QUERY PLAN is already used inside
      // bench 3 to explain the row-order reversal; a separate timing bench on a
      // four-row fixture would report noise, and a fixture large enough to be
      // honest belongs to a performance harness this pack does not have.
      { sessionNumber: 4, reason: "CUT" },
      // Session 6 is durability and restore: process death, fsync, and file-level
      // recovery. An in-process kernel cannot crash itself honestly.
      { sessionNumber: 6, reason: "A2" },
    ],
  },
  m17: {
    benchPackId: "m17",
    moduleNumber: 17,
    title: "Computer architecture and execution stack bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "65a4d8d8a67c2c103b8cc89627f2c0cc879397d41c72e8e56e60f0d15b51d4c5",
        sourcePath: "benches/src/m17/s3_isa_state_and_call_convention_trace.py",
        emitsArtifact: "ISA state and call-convention trace",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "b5c7e84dbbc3e5fba8592dc8d55d50fea272a21d624155099a308b83711a64ad",
        sourcePath: "benches/src/m17/s4_overlap_locality_model_and_causal_boundary.py",
        emitsArtifact: "overlap/locality model and causal boundary",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 6,
        sessionSha256: "24639e7afd5a3b0041010f49a21f76e728517311e9decca14795025de98367b3",
        sourcePath: "benches/src/m17/s6_bounded_architecture_claim_and_m28_handoff.py",
        emitsArtifact: "bounded architecture claim and M28 handoff",
        rungs: ["review-and-verify", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      // Session 2's 8-bit ADD wraparound is a genuine falsifiable prediction and
      // was the fourth-ranked pick; it lost to the three above on the pack's cut.
      { sessionNumber: 2, reason: "CUT" },
      // Session 5's artifact is a layer-ownership map and a routing queue — an
      // argument about what may be inferred from which layer. The one runnable
      // part, source_bridge_observation, would restate the causal boundary that
      // bench 4 already establishes with a moving number (R3').
      { sessionNumber: 5, reason: "A1" },
    ],
  },
  m18: {
    benchPackId: "m18",
    moduleNumber: 18,
    title: "Operating systems and resource mediation bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "f57aad057483dff970584c92ab4321895b67be73f6a64650e6a87eb3b4979376",
        sourcePath: "benches/src/m18/s3_translation_and_fault_classification_trace.py",
        emitsArtifact: "translation and fault-classification trace",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        // The plan's second pick for this module was Session 6. Session 6's
        // artifact is a "bounded operating-evidence dossier", which the rubric's
        // own A3 anti-signal disqualifies — it consumes Sessions 1-5 rather than
        // producing new evidence. Session 4 was substituted: path authority is a
        // real decision procedure over strings and a directory this process owns,
        // and it needs no privilege to be honest.
        sessionNumber: 4,
        sessionSha256: "3ad1effd19a692072428919028d65992236a8466a05467ebf72ca24bd8cc2827",
        sourcePath: "benches/src/m18/s4_name_open_resource_and_authority_card.py",
        emitsArtifact: "name, open-resource, and authority card",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      // Sessions 1, 2, and 5 need real processes, a real scheduler, and real
      // shutdown/recovery. A kernel that simulated them would model the
      // mechanism dishonestly, which is this module's whole subject.
      { sessionNumber: 1, reason: "A2" },
      { sessionNumber: 2, reason: "A2" },
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m19: {
    benchPackId: "m19",
    moduleNumber: 19,
    title: "Concurrency and parallelism bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "2ca27fe95c6434a1834f3e2afc408c09021979d29368f9a8a025d6714d6de333",
        sourcePath: "benches/src/m19/s1_interleaving_history_table.py",
        emitsArtifact: "interleaving history table",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 2,
        sessionSha256: "e1ecd8624c5283a9ba78b8ec3b7abf01192986789c8a676a0228047d40b1fb5b",
        sourcePath: "benches/src/m19/s2_critical_section_boundary_note.py",
        emitsArtifact: "critical-section boundary note",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "983f75edd759f326fe0e6b5da83793f5e0d684bb3cf23fe81ccd1966da736dd7",
        sourcePath: "benches/src/m19/s5_execution_model_decision_record.py",
        emitsArtifact: "execution-model decision record",
        rungs: ["review-and-verify", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 3, reason: "CUT" },
      // Session 4 is liveness: deadlock, livelock, and starvation. The reference
      // model's lock-order and executor-wait analyses are static graph checks,
      // and bench 2 already carries a state-space exploration of the same model —
      // a second one would be the same experiment shape (R3').
      { sessionNumber: 4, reason: "A4" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m20: {
    benchPackId: "m20",
    moduleNumber: 20,
    title: "Networks and application protocols bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "e9b890dc9623cc5233ba5ccf962ab7b4d765eba8c58e2a6770d428a6ce9932d1",
        sourcePath: "benches/src/m20/s2_frame_admission_trace.py",
        emitsArtifact: "frame admission trace",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "bb57ff668ce82eb606ae9e323643565c0f599f1ec8ec04d5677e92362c54c320",
        sourcePath: "benches/src/m20/s5_ambiguous_outcome_retry_ledger.py",
        emitsArtifact: "ambiguous-outcome retry ledger",
        rungs: ["review-and-verify", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      // Session 1 is name resolution: resolvers, caches, and TTLs this process
      // does not own.
      { sessionNumber: 1, reason: "A2" },
      { sessionNumber: 3, reason: "CUT" },
      // Session 4 is HTTP semantics — status codes, methods, and header policy
      // — which needs a real server to be evidence rather than a restatement.
      { sessionNumber: 4, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m21: {
    benchPackId: "m21",
    moduleNumber: 21,
    title: "Async and distributed systems bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "aac960f3ae9298aef0b8a16c0da428333007b6ace1ebed8c2d32479775049a15",
        sourcePath: "benches/src/m21/s2_task_lifetime_boundary_note.py",
        emitsArtifact: "task lifetime boundary note",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "9b188f6cf89e190f9bd5959aab59968fabb72d0a1841ffdb787ffc8aac0176be",
        sourcePath: "benches/src/m21/s3_admission_policy_record.py",
        emitsArtifact: "admission policy record",
        rungs: ["trace", "review-and-verify"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      // Sessions 4 and 5 are partial failure and replica claims across a real
      // network: a peer that may or may not have received a request, and clocks
      // this process does not own. An in-process kernel would have to script the
      // ambiguity it is supposed to be evidence about.
      { sessionNumber: 4, reason: "A2" },
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m22: {
    benchPackId: "m22",
    moduleNumber: 22,
    title: "Security, privacy, and trust boundaries bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "5ed2120479f707377d66ec77eb1849f772f944e0b1f1f0a58edd733ad2b93d25",
        sourcePath: "benches/src/m22/s2_identity_to_decision_ladder.py",
        emitsArtifact: "identity-to-decision ladder",
        rungs: ["review-and-verify", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "03514ba95588ffbdc9840e00af2089cd60996e4e8f0a34a7397558b25d1b52f3",
        sourcePath: "benches/src/m22/s3_sink_specific_encoding_map.py",
        emitsArtifact: "sink-specific encoding map",
        rungs: ["debug-and-defend", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      // Session 4 is cryptographic purpose selection — an argument about which
      // primitive answers which question. Running one would demonstrate that a
      // library computes, not that the choice was right.
      { sessionNumber: 4, reason: "A1" },
      { sessionNumber: 5, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m23: {
    benchPackId: "m23",
    moduleNumber: 23,
    title: "Programming languages and interpreters bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "7d778a5e7cd9c06d8d2379a0341e88239a5c4141daa5bf089d80afb64d8d007b",
        sourcePath: "benches/src/m23/s1_token_and_form_boundary_note.py",
        emitsArtifact: "token and form boundary note",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "b3e29ce3606f6d081e62658c95f1a33dc8c570b20050999d946451c4c4c6d525",
        sourcePath: "benches/src/m23/s3_environment_and_closure_trace.py",
        emitsArtifact: "environment and closure trace",
        rungs: ["trace", "debug-and-defend"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "75501daa55397e1bdaee64ec9057aed7db190eb86dd13392ed7f6ca1d1032f39",
        sourcePath: "benches/src/m23/s5_capability_boundary_note.py",
        emitsArtifact: "capability boundary note",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 2, reason: "CUT" },
      { sessionNumber: 4, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m24: {
    benchPackId: "m24",
    moduleNumber: 24,
    title: "CPython performance and memory bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "24962468d258b2ae5a5749e85d53671d756fc12bbf35508c601b0e8e83f0b546",
        sourcePath: "benches/src/m24/s2_alias_and_lifetime_trace.py",
        emitsArtifact: "alias and lifetime trace",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "b069447f71fa8ce9cff4405d5cd358303226b4572b0db12add732d353e4a200f",
        sourcePath: "benches/src/m24/s4_allocation_lens_comparison.py",
        emitsArtifact: "allocation lens comparison",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 6,
        sessionSha256: "7a514216f81dbb1881db5edd3739292db6f8c991621af7242f35a4ebf076a812",
        sourcePath: "benches/src/m24/s6_performance_evidence_dossier.py",
        emitsArtifact: "performance evidence dossier",
        rungs: ["review-and-verify", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      { sessionNumber: 3, reason: "CUT" },
      { sessionNumber: 5, reason: "CUT" },
    ],
  },
  m25: {
    benchPackId: "m25",
    moduleNumber: 25,
    title: "Evidence-grounded intelligent systems bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        // The prerequisite bench 4 leans on: the outcome_day column is what
        // makes a leakage check possible at all.
        sessionNumber: 2,
        sessionSha256: "dcab3409946bce8d9e8a2b8cf592f625071fb3fac0b6f499ccc583580e0e55fe",
        sourcePath: "benches/src/m25/s2_data_lineage_claim_map.py",
        emitsArtifact: "data lineage claim map",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "f50028dea9ea2df80466d017e3dceafdc2816c70e2d0249579b146ad688cbe60",
        sourcePath: "benches/src/m25/s4_calibration_and_uncertainty_report.py",
        emitsArtifact: "calibration and uncertainty report",
        rungs: ["review-and-verify", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 3, reason: "A1" },
      // Session 5 is the human-control account: who may override, when, and on
      // what evidence. That is a design argument about authority.
      { sessionNumber: 5, reason: "A1" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m31: {
    benchPackId: "m31",
    moduleNumber: 31,
    title: "Optimization and information bench pack",
    pythonFloor: "3.12",
    // Module 31 is authoring-only in the graph, so this pack is not reader-facing.
    visibility: "private-guided-study",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 4,
        sessionSha256: "0f1a5567695cbb5aa302807fba3942fb3f0cdb3770daeb6a4aa19868b3550cf0",
        sourcePath: "benches/src/m31/s4_solver_selection_rationale.py",
        emitsArtifact: "Solver-Selection Rationale",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "86c911897e377d65268e9bb399aea36c5a8d89764131aad682e2543c302a0bfc",
        sourcePath: "benches/src/m31/s5_stochastic_information_experiment_card.py",
        emitsArtifact: "Stochastic Information Experiment Card",
        rungs: ["trace", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 6,
        sessionSha256: "952ed1140439cff253139b077d5fe5c4a4489bb13af412c69ebd714053fa3ef2",
        sourcePath: "benches/src/m31/s6_optimization_information_evidence_dossier.py",
        emitsArtifact: "Optimization and Information Evidence Dossier",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 2, reason: "CUT" },
      { sessionNumber: 3, reason: "CUT" },
    ],
  },
  m32: {
    benchPackId: "m32",
    moduleNumber: 32,
    title: "Systems languages, scientific Python, accelerators bench pack",
    pythonFloor: "3.12",
    visibility: "private-guided-study",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "0ba406ec3e2c160859267689137a8551cd1779e027d5efb87f055bff1f682100",
        sourcePath: "benches/src/m32/s3_layout_numerics_note.py",
        emitsArtifact: "Layout-Numerics Note",
        rungs: ["trace", "debug-and-defend"],
        // The one pack in the corpus with a third-party dependency. numpy is on
        // the allowlist, and the session's subject IS array metadata — shape,
        // dtype, and strides are numpy's own concepts, so reimplementing them
        // would model the thing under examination rather than examine it.
        dependencies: ["numpy"],
      },
      {
        sessionNumber: 5,
        sessionSha256: "474bb60597bbfa6c5277a1079e1a1f1149051bd925bbec987ccb6088a380f0eb",
        sourcePath: "benches/src/m32/s5_autodiff_execution_trace.py",
        emitsArtifact: "Autodiff-Execution Trace",
        rungs: ["trace", "debug-and-defend"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      // Sessions 2, 4, and 6 concern execution transfer, buffer ownership across
      // a device boundary, and the dossier. The workbook itself concedes a
      // "CPU-only imagined queue" for the device work, so a bench would be
      // scripting the answer it claims to observe.
      { sessionNumber: 2, reason: "A2" },
      { sessionNumber: 4, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m33: {
    benchPackId: "m33",
    moduleNumber: 33,
    title: "Formal languages, computability, complexity bench pack",
    pythonFloor: "3.12",
    visibility: "private-guided-study",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "2ee2bbed124529100a80f23ab377629e2d20d95d4842f2159a2907a2e798fe4e",
        sourcePath: "benches/src/m33/s2_formal_claim_countermodel_ledger.py",
        emitsArtifact: "Formal-Claim Countermodel Ledger",
        rungs: ["trace", "debug-and-defend"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "d7d5268f4f57003e3248bdf4f004560963ad70503cc1451945ddbb81f8906b71",
        sourcePath: "benches/src/m33/s4_reduction_proof_skeleton.py",
        emitsArtifact: "Reduction-Proof Skeleton",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 3, reason: "A1" },
      // Session 5 is the complexity-claim card. The plan's own note records it
      // as an anti-bench: any single run is exactly the evidence the session
      // teaches you not to accept as a complexity-class claim, so benching it
      // would model the lesson backwards.
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m34: {
    benchPackId: "m34",
    moduleNumber: 34,
    title: "Classical AI search, constraints, decision bench pack",
    pythonFloor: "3.12",
    visibility: "private-guided-study",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "67c7d3acf2612bde66f9915bd9ae1b61cc6ad0cf6343c28391c024efcb8e682a",
        sourcePath: "benches/src/m34/s2_search_strategy_evidence_table.py",
        emitsArtifact: "Search-Strategy Evidence Table",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "53e32a37d9b6aa48c5fdb454c0d9604929cd1c27c18cb48e827f75503f22296b",
        sourcePath: "benches/src/m34/s3_constraint_objective_relaxation_sheet.py",
        emitsArtifact: "Constraint–Objective–Relaxation Sheet",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "752b7e805221ca3bf62317846c1e005d319d6b6fcfcb69dd292dbdf20eba418f",
        sourcePath: "benches/src/m34/s5_decision_under_uncertainty_card.py",
        emitsArtifact: "Decision-under-Uncertainty Card",
        rungs: ["review-and-verify", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 4, reason: "A3" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m35: {
    benchPackId: "m35",
    moduleNumber: 35,
    title: "Machine learning representation bench pack",
    pythonFloor: "3.12",
    visibility: "private-guided-study",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 3,
        sessionSha256: "c624b0bd80a6acc8c42f680c07f1ad6cc4aa625342b1bae58407e45754582c4c",
        sourcePath: "benches/src/m35/s3_evaluation_and_shift_plan.py",
        emitsArtifact: "Evaluation-and-Shift Plan",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "23ba317853b5b3cc58a062e395bd40fac6566c10d6d0a87338b14cd2a2c7bd6f",
        sourcePath: "benches/src/m35/s4_objective_optimization_generalization_trace.py",
        emitsArtifact: "Objective–Optimization–Generalization Trace",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 2, reason: "A1" },
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m36: {
    benchPackId: "m36",
    moduleNumber: 36,
    title: "Statistical learning theory and reliable deep learning bench pack",
    pythonFloor: "3.12",
    visibility: "private-guided-study",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "d71f573967523adc5741c7a905f38119ac90ced3f71497e4d56932c80ec1c245",
        sourcePath: "benches/src/m36/s2_optimization_generalization_gap_ledger.py",
        emitsArtifact: "Optimization–Generalization Gap Ledger",
        rungs: ["debug-and-defend", "review-and-verify"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "f7370bf9baa88bf619bbdd815f381395324003a7db03cc38863ea541e9ce8717",
        sourcePath: "benches/src/m36/s3_limit_and_nonclaim_card.py",
        emitsArtifact: "Limit-and-Nonclaim Card",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "66a3465ae4826b677c6518466717a584134e2a57bd7259b97f471ad6871e4064",
        sourcePath: "benches/src/m36/s4_theory_system_reproducibility_record.py",
        emitsArtifact: "Theory–System Reproducibility Record",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "A1" },
      { sessionNumber: 5, reason: "A2" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m27: {
    benchPackId: "m27",
    moduleNumber: 27,
    title: "Discrete mathematics bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "546fa6af0ff6830a718dcb4dc3fe62aa78220447f052f5d0a56004eb89fde724",
        sourcePath: "benches/src/m27/s1_definition_and_countermodel_card.py",
        emitsArtifact: "definition and countermodel card",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "b673e25487cd52acdab9a47885e420b59a973e91add3332c79fe74fee232e4fe",
        sourcePath: "benches/src/m27/s3_counting_and_recurrence_derivation.py",
        emitsArtifact: "counting and recurrence derivation",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "74817e5c8c74c6fa990a5aa9ca47f254b7ed038c6b1095b04253844726c35b9e",
        sourcePath: "benches/src/m27/s4_graph_structure_argument.py",
        emitsArtifact: "graph structure argument",
        rungs: ["debug-and-defend", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 2, reason: "CUT" },
      { sessionNumber: 5, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
  m28: {
    benchPackId: "m28",
    moduleNumber: 28,
    title: "Linear algebra and numerical stability bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 1,
        sessionSha256: "1e6402d1834dff1d7f253f9086e5552326629f3f145b1838593f5c5cbc173707",
        sourcePath: "benches/src/m28/s1_rank_and_lost_direction_account.py",
        emitsArtifact: "rank and lost-direction account",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 4,
        sessionSha256: "72b0b603554a41464b5d035dcb2ba3fa12bcbee752ab3371c25c15675c99c2c9",
        sourcePath: "benches/src/m28/s4_conditioning_and_stability_report.py",
        emitsArtifact: "conditioning and stability report",
        rungs: ["debug-and-defend", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 6,
        sessionSha256: "e87da0d11f0aae99a14e28f14857aa5b274165707367cf2022a78300a6ca497e",
        sourcePath: "benches/src/m28/s6_linear_algebra_evidence_dossier.py",
        emitsArtifact: "linear-algebra evidence dossier",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 2, reason: "CUT" },
      { sessionNumber: 3, reason: "CUT" },
      // The broadcasting and dtype experiment belongs to M32 session 3, where the
      // array-metadata machinery already lives; duplicating it here would violate R3'.
      { sessionNumber: 5, reason: "CUT" },
    ],
  },
  m29: {
    benchPackId: "m29",
    moduleNumber: 29,
    title: "Calculus and real analysis bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "d81e2eaa98af698d925a97105b32c979de49113a5ac50428a3abd02aba4f7f80",
        sourcePath: "benches/src/m29/s2_approximation_error_account.py",
        emitsArtifact: "approximation error account",
        rungs: ["debug-and-defend", "trace"],
        dependencies: ["matplotlib"],
      },
      {
        sessionNumber: 3,
        sessionSha256: "2caa04ccd6aae99184c0807f44ffb0ca2b35b1a708238f4f7d7bca44162e99ca",
        sourcePath: "benches/src/m29/s3_integration_derivation_record.py",
        emitsArtifact: "integration derivation record",
        rungs: ["trace", "map"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "8dda70b9fc7486c6e870732abe509964b863aa5e8482012eb03223036209e5c8",
        sourcePath: "benches/src/m29/s5_convergence_and_exchange_justification.py",
        emitsArtifact: "convergence and exchange justification",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      // The workbook hands the learner delta = epsilon/|m| directly, so a bench
      // would re-run a printed derivation.
      { sessionNumber: 1, reason: "A4" },
      { sessionNumber: 4, reason: "CUT" },
      { sessionNumber: 6, reason: "CUT" },
    ],
  },
  m30: {
    benchPackId: "m30",
    moduleNumber: 30,
    title: "Probability and statistical inference bench pack",
    pythonFloor: "3.12",
    visibility: "reader",
    policy: "sparse",
    sessions: [
      {
        sessionNumber: 2,
        sessionSha256: "759931ffcc0813bc1717dd48f5cf27c71a2c06980015051cca30c06f2caf82b6",
        sourcePath: "benches/src/m30/s2_moment_and_dependence_account.py",
        emitsArtifact: "moment and dependence account",
        rungs: ["recognize", "trace"],
        dependencies: [],
      },
      {
        sessionNumber: 3,
        sessionSha256: "55753d8f56bafdb771f916df189c04f3c53d913e9a47f998eac0688f5a5ebccf",
        sourcePath: "benches/src/m30/s3_convergence_and_simulation_record.py",
        emitsArtifact: "convergence and simulation record",
        rungs: ["trace", "recognize"],
        dependencies: [],
      },
      {
        sessionNumber: 5,
        sessionSha256: "f46d6daedc0625d2ccda22ce80317ea88a12c98659b4668cd7f7ab5610e4788f",
        sourcePath: "benches/src/m30/s5_inference_boundary_report.py",
        emitsArtifact: "inference boundary report",
        rungs: ["review-and-verify", "trace"],
        dependencies: [],
      },
    ],
    plannedSessions: [],
    unbenchedSessions: [
      { sessionNumber: 1, reason: "CUT" },
      { sessionNumber: 4, reason: "CUT" },
      { sessionNumber: 6, reason: "A3" },
    ],
  },
});

export const benchPackIds = Object.freeze(Object.keys(benchPackRegistry));

/**
 * A bench's primary rung is its first. The pack budget rules are read against
 * it, so the ordering in `rungs` is meaningful, not cosmetic.
 */
export function primaryRung(session) {
  return session?.rungs?.[0] ?? null;
}

export function findBenchPack(benchPackId) {
  if (typeof benchPackId !== "string") return null;
  return Object.hasOwn(benchPackRegistry, benchPackId)
    ? benchPackRegistry[benchPackId]
    : null;
}

export function benchIdFor(benchPackId, sessionNumber) {
  return `${benchPackId}-s${sessionNumber}`;
}

/**
 * Resolve a module's bench pack. Guard ordering mirrors `resolveModuleStudio`
 * so the two seams cannot disagree about what a locked or authoring-only module
 * exposes.
 *
 * @returns {{kind:"bench-pack"|"workbook-only"|"unavailable"|"configuration-error"}}
 */
export function resolveModuleBench(courseModule) {
  const state = courseModule?.state ?? {};

  if (state.availability === "locked") {
    return {
      kind: "unavailable",
      state: "locked",
      description:
        "This module is locked until its academic prerequisites and release evidence are available.",
    };
  }

  if (
    state.lifecycle !== "learner-material-ready" ||
    state.readerAccess === "hidden" ||
    state.availability === "authoring-only"
  ) {
    return {
      kind: "unavailable",
      state: "authoring-only",
      description:
        "This module is authoring-only: its bench pack, if any, is private guided study rather than released material.",
    };
  }

  const benchPackId = courseModule?.benchPackId ?? null;
  if (benchPackId === null) {
    return {
      kind: "workbook-only",
      description:
        "This module has no bench pack. Either a kernel would model its mechanism dishonestly — real filesystems, processes, and sockets — or its sessions are better served by repo and terminal work.",
    };
  }

  const registration = findBenchPack(benchPackId);
  if (!registration) {
    return {
      kind: "configuration-error",
      benchPackId,
      description:
        "The graph declares a bench pack that is not registered. Treat this as a configuration error, not as learning material.",
    };
  }

  return { kind: "bench-pack", registration };
}
