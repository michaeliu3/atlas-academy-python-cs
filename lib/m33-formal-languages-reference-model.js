/**
 * A deliberately small M33 reference fixture for one bounded DFA tracing
 * exercise. It has no learner route, persistence, network, filesystem, model,
 * parser, theorem-proving, or general automata capability. Its purpose is to
 * make the state-by-state meaning of one finite machine inspectable.
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
