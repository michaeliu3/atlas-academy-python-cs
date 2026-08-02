import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";
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

test("the M33 workbook connects the formal model classes with an original derivation trace", async () => {
  const workbook = await readFile(
    "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Formal-model ladder — choose the smallest proven scope/u);
  assert.match(workbook, /\| DFA \|/u);
  assert.match(workbook, /\| NFA \|/u);
  assert.match(workbook, /ordinary formal regular expression/u);
  assert.match(workbook, /context-free grammar \(CFG\)/u);
  assert.match(workbook, /Every regular language is context-free/u);
  assert.match(workbook, /### Tiny derivation trace — syntax before meaning/u);
  assert.match(workbook, /S \\Rightarrow \(S\)S \\Rightarrow \(\)S/u);
  assert.match(workbook, /It does not establish a semantic\s+result, safe evaluation, or authority to act\./u);
  assert.match(workbook, /### NFA-to-DFA subset construction — track possible states/u);
  assert.match(workbook, /strings ending in `01`/u);
  assert.match(workbook, /The\s+constructed DFA accepts exactly when its subset contains\s+`q2`/u);
  assert.match(workbook, /### A computability mapping reduction — halting becomes acceptance/u);
  assert.match(workbook, /HALT_TM \\le_m A_TM/u);
  assert.match(workbook, /input encoding is malformed.*fixed no-instance/isu);
  assert.match(workbook, /`N` ignores its\s+own input/u);
});

test("the M33 workbook connects construction, machine memory, encodings, and proof obligations", async () => {
  const workbook = await readFile(
    "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Regex → NFA → DFA — one language, three representations/u);
  assert.match(workbook, /\(0\|1\)\*01/u);
  assert.match(workbook, /formal-regex semantics/u);
  assert.match(workbook, /### Stack trace — why nested structure is not finite-state/u);
  assert.match(workbook, /push `\(`/u);
  assert.match(workbook, /accept\s+only when the stack is empty/u);
  assert.match(workbook, /### Proof-debugging card — the pumping lemma's quantifier order/u);
  assert.match(workbook, /every legal decomposition/u);
  assert.match(workbook, /### Encoding contract before diagonalization/u);
  assert.match(workbook, /D\(\\langle D\\rangle\)/u);
  assert.match(workbook, /### Decision, search, and optimization are different contracts/u);
  assert.match(workbook, /Return a minimum cover/u);
  assert.match(workbook, /verifier checks a supplied candidate/u);
  assert.match(workbook, /does not decide whether some candidate exists/u);
});

test("the M33 workbook exposes claim routes and labels interface-dependent sketches", async () => {
  const workbook = await readFile(
    "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Claim\/source labels/u);
  assert.match(workbook, /M33-C01, M33-C04 -> S33-01, S33-03/u);
  assert.match(workbook, /M33-C02–M33-C03 -> S33-01, S33-02/u);
  assert.match(workbook, /M33-C05–M33-C06 -> S33-01, S33-04/u);
  assert.match(workbook, /M33-C08 -> S33-01, S33-06, S33-07/u);
  assert.match(workbook, /M33-C09–M33-C10 -> S33-01, S33-06, S33-07/u);
  assert.match(workbook, /language-neutral pedagogical pseudocode, not runnable Python/u);
  assert.match(workbook, /~~~text\ndef run_for_at_most/u);
  assert.match(workbook, /interface-dependent pedagogical pseudocode, not a runnable Python/u);
  assert.match(workbook, /~~~text\ndef verifies_vertex_cover/u);
  assert.doesNotMatch(workbook, /~~~python\ndef run_for_at_most/u);
  assert.doesNotMatch(workbook, /~~~python\ndef verifies_vertex_cover/u);
});

test("the M33 authoring diagram keeps its declared prose alternative", async () => {
  const sourcePath = "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md";
  const workbook = await readFile(sourcePath, "utf8");
  const blocks = scanMermaidBlocks(workbook, { sourcePath });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 1);
  assert.equal(report.summary.completeBlocks, 1);
  assert.deepEqual(blocks[0].metadata, {
    id: "m33-formal-claim-route",
    title: "The M33 route from strings to bounded conclusions",
    alternative: "A finite alphabet forms strings. A named language, grammar, or machine gives a formal object. A precisely stated question and proof obligation lead to a resource claim or limit, followed by a practical non-claim rather than automatic authority.",
  });
});
