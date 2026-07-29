import assert from "node:assert/strict";
import test from "node:test";

import {
  DIAGNOSTIC_ASSESSMENT_VERSION,
  DIAGNOSTIC_SCHEMA_VERSION,
  buildDiagnosticResult,
  classifyResponse,
  createEmptyAttempt,
  diagnosticQuestions,
  diagnosticReducer,
  parseStoredAttempt,
  toLearningBrief,
  validateDiagnosticDefinition,
} from "../lib/diagnostic-model.js";

const FIXED_TIME = "2026-07-29T12:00:00.000Z";

function revealedResponse(optionId, confidence) {
  return { optionId, confidence, revealed: true };
}

function attemptWith(responsesByQuestionId, completed = false) {
  return {
    ...createEmptyAttempt(FIXED_TIME),
    responsesByQuestionId,
    completed,
  };
}

function answerQuestion(state, question, optionId, confidence) {
  let next = diagnosticReducer(state, {
    type: "chooseOption",
    questionId: question.id,
    optionId,
    updatedAt: FIXED_TIME,
  });
  next = diagnosticReducer(next, {
    type: "setConfidence",
    questionId: question.id,
    confidence,
    updatedAt: FIXED_TIME,
  });
  return diagnosticReducer(next, {
    type: "reveal",
    questionId: question.id,
    updatedAt: FIXED_TIME,
  });
}

test("the diagnostic definition exposes the 13 stable curriculum probes", () => {
  assert.deepEqual(validateDiagnosticDefinition(), []);
  assert.deepEqual(
    diagnosticQuestions.map((question) => question.id),
    [
      "python-state-aliasing",
      "recursion-termination",
      "adt-observation-contract",
      "cost-hidden-membership",
      "lazy-shared-cursor",
      "hash-key-stability",
      "bfs-discovery-timing",
      "architecture-dependency-direction",
      "debugging-flaky-evidence",
      "agent-retry-review",
      "artifact-pickle-boundary",
      "sql-three-valued-logic",
      "transaction-replay-identity",
    ],
  );
  assert.deepEqual(
    diagnosticQuestions.map((question) => question.number),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  );

  const questionIds = diagnosticQuestions.map((question) => question.id);
  assert.equal(new Set(questionIds).size, 13);

  for (const question of diagnosticQuestions) {
    assert.deepEqual(
      question.options.map((option) => option.id),
      ["A", "B", "C", "D"],
      `${question.id} should expose stable option IDs`,
    );
    assert.equal(
      new Set(question.options.map((option) => option.id)).size,
      4,
      `${question.id} should not duplicate an option ID`,
    );

    for (const option of question.options) {
      assert.ok(
        option.feedback.trim().length > 0,
        `${question.id}/${option.id} should explain the observation`,
      );
      if (option.id === question.correctOptionId) {
        assert.equal(
          option.diagnosis,
          null,
          `${question.id}/${option.id} should not invent a misconception`,
        );
      } else {
        assert.ok(
          option.diagnosis?.trim(),
          `${question.id}/${option.id} should route its misconception`,
        );
      }
    }
  }
});

test("stored attempts round-trip only when their version and state are valid", () => {
  const first = diagnosticQuestions[0];
  const second = diagnosticQuestions[1];
  const attempt = {
    ...createEmptyAttempt(FIXED_TIME),
    currentQuestionId: second.id,
    responsesByQuestionId: {
      [first.id]: revealedResponse(first.correctOptionId, "medium"),
      [second.id]: {
        optionId: second.options[0].id,
        revealed: false,
      },
    },
  };

  assert.deepEqual(parseStoredAttempt(JSON.stringify(attempt)), attempt);
  assert.deepEqual(parseStoredAttempt(attempt), attempt);

  const invalidAttempts = [
    "{not JSON",
    null,
    { ...attempt, schemaVersion: DIAGNOSTIC_SCHEMA_VERSION + 1 },
    {
      ...attempt,
      assessmentVersion: `${DIAGNOSTIC_ASSESSMENT_VERSION}-stale`,
    },
    { ...attempt, currentQuestionId: "unknown-question" },
    { ...attempt, completed: "yes" },
    { ...attempt, updatedAt: 1234 },
    {
      ...attempt,
      responsesByQuestionId: {
        ...attempt.responsesByQuestionId,
        "unknown-question": { revealed: false },
      },
    },
    {
      ...attempt,
      responsesByQuestionId: {
        [first.id]: { optionId: "Z", confidence: "high", revealed: true },
      },
    },
    {
      ...attempt,
      responsesByQuestionId: {
        [first.id]: {
          optionId: first.correctOptionId,
          confidence: "absolute",
          revealed: true,
        },
      },
    },
    {
      ...attempt,
      responsesByQuestionId: {
        [first.id]: {
          optionId: first.correctOptionId,
          confidence: "high",
          revealed: "yes",
        },
      },
    },
    {
      ...attempt,
      responsesByQuestionId: {
        [first.id]: { confidence: "high", revealed: true },
      },
    },
    { ...attempt, completed: true },
  ];

  for (const invalid of invalidAttempts) {
    assert.equal(
      parseStoredAttempt(invalid),
      null,
      `invalid persisted state should be discarded: ${JSON.stringify(invalid)}`,
    );
  }
});

test("the reducer requires answer and confidence, locks feedback, and completes only after every reveal", () => {
  const first = diagnosticQuestions[0];
  const secondOption = first.options.find(
    (option) => option.id !== first.correctOptionId,
  ).id;
  const empty = createEmptyAttempt(FIXED_TIME);

  assert.strictEqual(
    diagnosticReducer(empty, {
      type: "reveal",
      questionId: first.id,
      updatedAt: FIXED_TIME,
    }),
    empty,
  );
  assert.strictEqual(
    diagnosticReducer(empty, {
      type: "complete",
      updatedAt: FIXED_TIME,
    }),
    empty,
  );

  const revealed = answerQuestion(empty, first, first.correctOptionId, "high");
  assert.deepEqual(
    revealed.responsesByQuestionId[first.id],
    revealedResponse(first.correctOptionId, "high"),
  );

  assert.strictEqual(
    diagnosticReducer(revealed, {
      type: "chooseOption",
      questionId: first.id,
      optionId: secondOption,
      updatedAt: "2026-07-29T12:01:00.000Z",
    }),
    revealed,
    "revealed evidence should be immutable",
  );

  let fullyRevealed = createEmptyAttempt(FIXED_TIME);
  for (const question of diagnosticQuestions) {
    fullyRevealed = answerQuestion(
      fullyRevealed,
      question,
      question.correctOptionId,
      "high",
    );
  }

  assert.equal(fullyRevealed.completed, false);
  const completed = diagnosticReducer(fullyRevealed, {
    type: "complete",
    updatedAt: "2026-07-29T12:02:00.000Z",
  });
  assert.equal(completed.completed, true);
  assert.equal(completed.updatedAt, "2026-07-29T12:02:00.000Z");
});

test("confidence changes routing priority without pretending it changes correctness", () => {
  const question = diagnosticQuestions[0];
  const wrongOption = question.options.find(
    (option) => option.id !== question.correctOptionId,
  );
  const cases = [
    [wrongOption.id, "high", false, "repair", 0],
    [wrongOption.id, "medium", false, "repair", 1],
    [wrongOption.id, "low", false, "repair", 2],
    [question.correctOptionId, "low", true, "verify", 3],
    [question.correctOptionId, "medium", true, "verify", 4],
    [question.correctOptionId, "high", true, "ready", 5],
  ];

  for (const [optionId, confidence, correct, tier, priority] of cases) {
    const signal = classifyResponse(
      question,
      revealedResponse(optionId, confidence),
    );
    assert.ok(signal);
    assert.equal(signal.correct, correct);
    assert.equal(signal.tier, tier);
    assert.equal(signal.priority, priority);
  }

  assert.equal(
    classifyResponse(question, {
      optionId: question.correctOptionId,
      confidence: "high",
      revealed: false,
    }),
    null,
  );
  assert.equal(
    classifyResponse(question, {
      optionId: question.correctOptionId,
      confidence: "absolute",
      revealed: true,
    }),
    null,
    "classification should reject confidence outside the persisted enum",
  );
});

test("results prioritize misconceptions, then build one dependency-ordered route per section", () => {
  const responsesByQuestionId = {};
  for (const question of diagnosticQuestions) {
    const wrongOption = question.options.find(
      (option) => option.id !== question.correctOptionId,
    );
    responsesByQuestionId[question.id] = revealedResponse(
      wrongOption.id,
      question.number === 13 ? "high" : "medium",
    );
  }

  const result = buildDiagnosticResult(attemptWith(responsesByQuestionId));

  assert.equal(result.questionCount, 13);
  assert.equal(result.answeredCount, 13);
  assert.equal(result.correctCount, 0);
  assert.deepEqual(
    result.prioritySignals.map((signal) => signal.question.number),
    [13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "high-confidence errors should lead the review queue",
  );
  assert.deepEqual(
    result.learningRoute.map((route) => route.moduleNumber),
    [1, 2, 3, 5, 7, 8, 10, 12, 13, 14, 15, 16, 16],
    "prerequisite order should outrank raw urgency in the learning route",
  );
  assert.equal(
    new Set(result.learningRoute.map((route) => route.href)).size,
    result.learningRoute.length,
    "a section should appear at most once",
  );
  assert.deepEqual(
    result.learningRoute.slice(-2).map((route) => route.questionNumber),
    [13, 12],
    "distinct repair sections in one module should remain visible and urgency-ordered",
  );
});

test("the learning brief preserves counts, misconception evidence, and exact repair links", () => {
  const first = diagnosticQuestions[0];
  const second = diagnosticQuestions[1];
  const wrongFirst = first.options.find(
    (option) => option.id !== first.correctOptionId,
  );
  const attempt = attemptWith({
    [first.id]: revealedResponse(wrongFirst.id, "high"),
    [second.id]: revealedResponse(second.correctOptionId, "high"),
  });

  const brief = toLearningBrief(attempt);

  assert.match(brief, /Atlas Academy — Module 0 learning brief/u);
  assert.match(brief, new RegExp(`Assessment: ${DIAGNOSTIC_ASSESSMENT_VERSION}`));
  assert.match(brief, /Completed responses: 2\/13/u);
  assert.match(brief, /Correct models sampled: 1\/13/u);
  assert.match(brief, /Ready to transfer: 1/u);
  assert.match(brief, /Repair first: 1/u);
  assert.match(
    brief,
    /Q01 Python state and mental execution: A\/high → repair \[PY_STATE_AUGASSIGN_ALWAYS_REBINDS\]/u,
  );
  assert.match(
    brief,
    /Module 1 — Worked example — draw before running: \/modules\/01-values-state-execution#worked-example--draw-before-running/u,
  );
  assert.match(
    brief,
    /treat these as hypotheses\. Verify with explanation, code tracing, and transfer/u,
  );
});
