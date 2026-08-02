/**
 * Deliberately small M33 reference fixtures for one bounded DFA tracing
 * exercise and one static, hand-checked reduction-proof card. They have no
 * learner route, persistence, network, filesystem, model, parser,
 * theorem-proving, or general automata capability. Their purpose is to make
 * one finite machine trace and one proof obligation set inspectable.
 */

const EXERCISE_INPUT_LIMIT = 32;
const START_STATE = "even";
const ACCEPTING_STATE = "even";

const transitionTable = Object.freeze({
  even: Object.freeze({ "0": "even", "1": "odd" }),
  odd: Object.freeze({ "0": "odd", "1": "even" }),
});

export const M33_EVEN_ONES_DFA = Object.freeze({
  id: "m33-s02-even-ones-dfa",
  alphabet: Object.freeze(["0", "1"]),
  states: Object.freeze(["even", "odd"]),
  startState: START_STATE,
  acceptingStates: Object.freeze([ACCEPTING_STATE]),
  transitionTable,
  exerciseInputLimit: EXERCISE_INPUT_LIMIT,
  stateMeanings: Object.freeze({
    even: "The consumed prefix contains an even number of 1 symbols.",
    odd: "The consumed prefix contains an odd number of 1 symbols.",
  }),
  truthBoundary:
    "This declared two-state DFA recognizes only the stated parity language over binary strings. Its bounded worked traces are examples, not a proof about a different machine or language.",
});

export const M33_EVEN_ONES_TRACE_EXERCISES = Object.freeze([
  Object.freeze({
    input: "",
    expectedStates: Object.freeze(["even"]),
    expectedAccepted: true,
  }),
  Object.freeze({
    input: "1",
    expectedStates: Object.freeze(["even", "odd"]),
    expectedAccepted: false,
  }),
  Object.freeze({
    input: "1011",
    expectedStates: Object.freeze(["even", "odd", "odd", "even", "odd"]),
    expectedAccepted: false,
  }),
  Object.freeze({
    input: "1010",
    expectedStates: Object.freeze(["even", "odd", "odd", "even", "even"]),
    expectedAccepted: true,
  }),
]);

const M33_VC_TO_IS_PATH_FOUR_GRAPH = Object.freeze({
  id: "m33-vc-is-path-four",
  vertices: Object.freeze(["v0", "v1", "v2", "v3"]),
  edges: Object.freeze([
    Object.freeze(["v0", "v1"]),
    Object.freeze(["v1", "v2"]),
    Object.freeze(["v2", "v3"]),
  ]),
});

const M33_VC_TO_IS_FIXED_TARGET_NO_INSTANCE = Object.freeze({
  serialized: "2#2#0,1",
  graph: Object.freeze({
    id: "m33-fixed-two-vertex-edge",
    vertices: Object.freeze(["a", "b"]),
    edges: Object.freeze([Object.freeze(["a", "b"])]),
  }),
  targetThreshold: 2,
  targetMembership: false,
  reason:
    "A two-vertex graph with one edge has no independent set of size at least two.",
});

/**
 * A static proof-reading card for the standard VC-to-IS complement map. It is
 * intentionally not an implementation of graph parsing, verification, search,
 * or reduction checking. The fixed P4 cases are there to expose the threshold
 * and both membership outcomes before the learner reads the symbolic proof.
 */
export const M33_VC_TO_IS_MICRO_PROOF_CARD = Object.freeze({
  id: "m33-s04-vc-to-is-micro-proof-card",
  sourceLanguage:
    "VC contains canonical encodings <G,k> where finite simple undirected graph G has a vertex cover of size at most k.",
  targetLanguage:
    "IS contains canonical encodings <G,t> where finite simple undirected graph G has an independent set of size at least t.",
  inputConvention: Object.freeze({
    validInput:
      "A valid input has form n#k#i,j;i,j;... with canonical nonnegative decimal n,k, 0 <= k <= n, and a sorted duplicate-free edge list over vertices 0 through n-1.",
    malformedInput:
      "A malformed string is not in VC; the declared total map sends it to the fixed target no-instance below.",
    fixedTargetNoInstance: M33_VC_TO_IS_FIXED_TARGET_NO_INSTANCE,
  }),
  transformation: Object.freeze({
    thresholdFormula: "t = |V| - k",
    validInputWork:
      "For a valid n#k#E, output n#(n-k)#E. Separator/decimal/bounds/order/duplicate checks, decimal subtraction, and copying are polynomial in the input-string length.",
    totalityAndTime:
      "The valid n#k#E branch uses t = n-k; every other string maps to 2#2#0,1. The declared separator, decimal, bounds, order, duplicate, subtraction, and copying checks are polynomial in the input-string length.",
    forwardDirection:
      "If C is a vertex cover with |C| <= k, then V\\C is independent and has size at least |V|-k.",
    reverseDirection:
      "If I is independent with |I| >= |V|-k, then V\\I is a vertex cover and has size at most k.",
  }),
  workedGraph: M33_VC_TO_IS_PATH_FOUR_GRAPH,
  handCheckedCases: Object.freeze([
    Object.freeze({
      label: "yes case on P4",
      sourceThreshold: 2,
      targetThreshold: 2,
      sourceWitness: Object.freeze(["v1", "v2"]),
      targetWitness: Object.freeze(["v0", "v3"]),
      sourceMembership: true,
      targetMembership: true,
      checkReason:
        "{v1,v2} covers every path edge; its complement {v0,v3} has no internal edge.",
    }),
    Object.freeze({
      label: "no case on P4",
      sourceThreshold: 1,
      targetThreshold: 3,
      sourceWitness: null,
      targetWitness: null,
      sourceMembership: false,
      targetMembership: false,
      checkReason:
        "The disjoint path edges (v0,v1) and (v2,v3) rule out a one-vertex cover; no three vertices of P4 are independent.",
    }),
  ]),
  finiteCheckBoundary:
    "This fixed yes/no check illustrates the complement relation; it does not prove the iff for all graph encodings, establish NP-completeness, or validate a different reduction.",
  truthBoundary:
    "This static teaching card is not a parser, solver, or proof checker. It does not accept arbitrary encodings, search for witnesses, prove a theorem, or decide a complexity claim beyond its declared hand-checked examples and proof-reading obligations.",
});

function normalizedExerciseInput(input) {
  if (typeof input !== "string") {
    throw new TypeError("M33 even-ones DFA input must be a string.");
  }
  if (input.length > EXERCISE_INPUT_LIMIT) {
    throw new RangeError(
      `M33 even-ones DFA accepts at most ${EXERCISE_INPUT_LIMIT} symbols per reference exercise.`,
    );
  }
  if ([...input].some((symbol) => symbol !== "0" && symbol !== "1")) {
    throw new RangeError("M33 even-ones DFA only accepts symbols 0 and 1.");
  }
  return input;
}

function nextState(state, symbol) {
  return transitionTable[state][symbol];
}

/**
 * Trace the one declared DFA across a finite binary input. Each record gives
 * the state after its listed prefix; acceptance is only membership in this
 * DFA's stated parity language, not a claim about regularity in general.
 *
 * @param {string} input
 */
export function traceM33EvenOnesDfa(input) {
  const normalizedInput = normalizedExerciseInput(input);
  let state = START_STATE;
  const trace = [
    {
      step: 0,
      consumedPrefix: "",
      consumedSymbol: null,
      state,
      accepting: state === ACCEPTING_STATE,
    },
  ];

  for (const [index, symbol] of [...normalizedInput].entries()) {
    state = nextState(state, symbol);
    trace.push({
      step: index + 1,
      consumedPrefix: normalizedInput.slice(0, index + 1),
      consumedSymbol: symbol,
      state,
      accepting: state === ACCEPTING_STATE,
    });
  }

  const accepted = state === ACCEPTING_STATE;
  return {
    id: "m33-s02-even-ones-dfa-trace",
    dfa: M33_EVEN_ONES_DFA,
    input: normalizedInput,
    trace,
    finalState: state,
    accepted,
    expectedOutcome: accepted ? "accept" : "reject",
    truthBoundary:
      "This bounded trace runner is not a theorem checker and not an undecidability oracle. It does not decide DFA equivalence, regularity, grammar membership, recognizer/decider behavior, reductions, complexity, halting, or claims outside this one declared DFA and input bound.",
  };
}
