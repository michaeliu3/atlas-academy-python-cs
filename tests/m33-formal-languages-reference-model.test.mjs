import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  M33_EVEN_ONES_DFA,
  M33_EVEN_ONES_TRACE_EXERCISES,
  traceM33EvenOnesDfa,
} from "../lib/m33-formal-languages-reference-model.js";

test("the M33 bounded DFA fixture returns the independently worked parity traces", () => {
  assert.equal(M33_EVEN_ONES_DFA.id, "m33-s02-even-ones-dfa");
  assert.deepEqual(M33_EVEN_ONES_DFA.alphabet, ["0", "1"]);
  assert.equal(M33_EVEN_ONES_DFA.exerciseInputLimit, 32);

  const workedOutcomes = [
    { input: "", states: ["even"], accepted: true },
    { input: "1", states: ["even", "odd"], accepted: false },
    { input: "1011", states: ["even", "odd", "odd", "even", "odd"], accepted: false },
    { input: "1010", states: ["even", "odd", "odd", "even", "even"], accepted: true },
  ];

  for (const expected of workedOutcomes) {
    const result = traceM33EvenOnesDfa(expected.input);

    assert.equal(result.input, expected.input);
    assert.deepEqual(
      result.trace.map(({ state }) => state),
      expected.states,
    );
    assert.equal(result.finalState, expected.states.at(-1));
    assert.equal(result.accepted, expected.accepted);
    assert.equal(result.expectedOutcome, expected.accepted ? "accept" : "reject");
  }
});

test("the M33 fixture exposes its finite exercise set and rejects claims outside it", () => {
  assert.deepEqual(
    M33_EVEN_ONES_TRACE_EXERCISES.map(({ input, expectedStates, expectedAccepted }) => ({
      input,
      expectedStates,
      expectedAccepted,
    })),
    [
      { input: "", expectedStates: ["even"], expectedAccepted: true },
      { input: "1", expectedStates: ["even", "odd"], expectedAccepted: false },
      {
        input: "1011",
        expectedStates: ["even", "odd", "odd", "even", "odd"],
        expectedAccepted: false,
      },
      {
        input: "1010",
        expectedStates: ["even", "odd", "odd", "even", "even"],
        expectedAccepted: true,
      },
    ],
  );

  const result = traceM33EvenOnesDfa("1010");
  assert.match(result.truthBoundary, /not a theorem checker/u);
  assert.match(result.truthBoundary, /not an undecidability oracle/u);
  assert.throws(() => traceM33EvenOnesDfa("102"), /only accepts symbols 0 and 1/u);
  assert.throws(() => traceM33EvenOnesDfa("0".repeat(33)), /at most 32 symbols/u);
});

test("the M33 workbook makes the bounded trace a prediction-before-inspection exercise", async () => {
  const workbook = await readFile(
    "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Bounded reference fixture — trace before claim/u);
  assert.match(workbook, /traceM33EvenOnesDfa\("1010"\)/u);
  assert.match(workbook, /neither a regularity proof nor an undecidability oracle/u);
});
