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
  requiredFoundationAreas,
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

test("the diagnostic definition exposes the 20 stable curriculum probes", () => {
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
      "memory-locality-cache-lines",
      "quantifier-scope-countermodel",
      "linear-algebra-basis-coordinates",
      "calculus-gradient-local-change",
      "probability-conditional-evidence",
      "optimization-feasible-descent",
      "ml-evaluation-leakage",
    ],
  );
  assert.deepEqual(
    diagnosticQuestions.map((question) => question.number),
    [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      19, 20,
    ],
  );
  assert.deepEqual(
    diagnosticQuestions.slice(13).map((question) => question.arc),
    ["IV", "VI", "VI", "VI", "VI", "VI", "VI"],
    "foundation probes should retain their canonical knowledge-arc labels",
  );

  const questionIds = diagnosticQuestions.map((question) => question.id);
  assert.equal(new Set(questionIds).size, 20);

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

test("the intake samples every required foundation and keeps advanced extensions non-routable", () => {
  assert.deepEqual(
    requiredFoundationAreas.map((area) => area.id),
    [
      "python",
      "algorithms",
      "systems",
      "discrete-math",
      "linear-algebra",
      "calculus",
      "probability",
      "optimization",
      "ai-ml",
    ],
  );

  const primaryProbeByArea = Object.fromEntries(
    requiredFoundationAreas.map((area) => [area.id, area.probeQuestionId]),
  );
  assert.deepEqual(primaryProbeByArea, {
    python: "python-state-aliasing",
    algorithms: "cost-hidden-membership",
    systems: "memory-locality-cache-lines",
    "discrete-math": "quantifier-scope-countermodel",
    "linear-algebra": "linear-algebra-basis-coordinates",
    calculus: "calculus-gradient-local-change",
    probability: "probability-conditional-evidence",
    optimization: "optimization-feasible-descent",
    "ai-ml": "ml-evaluation-leakage",
  });
  for (const area of requiredFoundationAreas) {
    const probe = diagnosticQuestions.find(
      (question) => question.id === area.probeQuestionId,
    );
    assert.ok(probe, `${area.id} must name an existing probe`);
    assert.ok(
      probe.foundationAreas.includes(area.id),
      `${area.id} probe must declare the area it samples`,
    );
  }

  const responsesByQuestionId = Object.fromEntries(
    diagnosticQuestions.map((question) => {
      const wrongOption = question.options.find(
        (option) => option.id !== question.correctOptionId,
      );
      return [question.id, revealedResponse(wrongOption.id, "high")];
    }),
  );
  const result = buildDiagnosticResult(attemptWith(responsesByQuestionId));
  const advancedBridges = result.bridgeRecommendations.filter(
    (recommendation) => recommendation.extension,
  );

  assert.deepEqual(
    advancedBridges.map((recommendation) => ({
      areaId: recommendation.area.id,
      moduleNumber: recommendation.extension.moduleNumber,
      status: recommendation.extension.status,
    })),
    [
      {
        areaId: "optimization",
        moduleNumber: 31,
        status: "authoring-only",
      },
      {
        areaId: "ai-ml",
        moduleNumber: 35,
        status: "authoring-only",
      },
    ],
  );
  for (const recommendation of result.bridgeRecommendations) {
    assert.ok(
      recommendation.route.moduleNumber <= 30,
      `${recommendation.area.id} must start from a published foundation`,
    );
    assert.equal(
      Object.hasOwn(recommendation.extension ?? {}, "href"),
      false,
      `${recommendation.area.id} must not expose a route to an unavailable extension`,
    );
    assert.ok(
      Array.isArray(recommendation.route.academicPrerequisites),
      `${recommendation.area.id} must disclose graph prerequisites for its direct repair link`,
    );
  }
  const transactionQuestion = diagnosticQuestions.find(
    (question) => question.id === "transaction-replay-identity",
  );
  assert.ok(transactionQuestion);
  const transactionWrongOption = transactionQuestion.options.find(
    (option) => option.id !== transactionQuestion.correctOptionId,
  );
  assert.ok(transactionWrongOption);
  const transactionResult = buildDiagnosticResult(
    attemptWith({
      [transactionQuestion.id]: revealedResponse(
        transactionWrongOption.id,
        "high",
      ),
    }),
  );
  const transactionRepair = transactionResult.bridgeRecommendations.find(
    (recommendation) => recommendation.route.moduleNumber === 16,
  );
  assert.deepEqual(
    transactionRepair?.route.academicPrerequisites.map(
      (prerequisite) => prerequisite.moduleNumber,
    ),
    [15],
    "a direct M16 repair link must retain the M15 academic prerequisite",
  );
  const brief = toLearningBrief(attemptWith(responsesByQuestionId));
  assert.match(brief, /Foundation bridge recommendations:/u);
  assert.match(
    brief,
    /Future Module 31 \(Optimization & Information\) remains authoring-only; it is not a route\./u,
  );
  assert.match(
    brief,
    /Future Module 35 \(Machine Learning & Representation\) remains authoring-only; it is not a route\./u,
  );
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

  assert.equal(result.questionCount, 20);
  assert.equal(result.answeredCount, 20);
  assert.equal(result.correctCount, 0);
  assert.deepEqual(
    result.prioritySignals.map((signal) => signal.question.number),
    [13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20],
    "high-confidence errors should lead the review queue",
  );
  assert.deepEqual(
    result.learningRoute.map((route) => route.moduleNumber),
    [
      1, 2, 3, 5, 27, 7, 8, 10, 12, 13, 14, 15, 16, 16, 17, 28, 29, 29,
      30, 30,
    ],
    "canonical dependency order should outrank raw urgency in the learning route",
  );
  const orderedModuleNumbers = result.learningRoute.map(
    (route) => route.moduleNumber,
  );
  assert.ok(
    orderedModuleNumbers.indexOf(5) < orderedModuleNumbers.indexOf(27) &&
      orderedModuleNumbers.indexOf(27) < orderedModuleNumbers.indexOf(7),
    "the canonical M5 → M27 → M6 handoff must remain visible",
  );
  assert.ok(
    orderedModuleNumbers.indexOf(17) < orderedModuleNumbers.indexOf(28),
    "the canonical M17 → M28 handoff must remain visible",
  );
  assert.equal(
    new Set(result.learningRoute.map((route) => route.href)).size,
    result.learningRoute.length,
    "a section should appear at most once",
  );
  assert.deepEqual(
    result.learningRoute.slice(-4).map((route) => route.questionNumber),
    [17, 19, 18, 20],
    "distinct mathematics and inference repairs remain visible in route order",
  );
  assert.deepEqual(
    result.bridgeRecommendations.map((recommendation) => ({
      areaId: recommendation.area.id,
      questionNumber: recommendation.questionNumber,
      routeModuleNumber: recommendation.route.moduleNumber,
    })),
    [
      { areaId: "python", questionNumber: 13, routeModuleNumber: 16 },
      { areaId: "algorithms", questionNumber: 4, routeModuleNumber: 5 },
      { areaId: "systems", questionNumber: 13, routeModuleNumber: 16 },
      { areaId: "discrete-math", questionNumber: 2, routeModuleNumber: 2 },
      { areaId: "linear-algebra", questionNumber: 16, routeModuleNumber: 28 },
      { areaId: "calculus", questionNumber: 17, routeModuleNumber: 29 },
      { areaId: "probability", questionNumber: 18, routeModuleNumber: 30 },
      { areaId: "optimization", questionNumber: 19, routeModuleNumber: 29 },
      { areaId: "ai-ml", questionNumber: 20, routeModuleNumber: 30 },
    ],
    "the bridge plan retains the evidence signal while naming a published foundation",
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
  assert.match(brief, /Completed responses: 2\/20/u);
  assert.match(brief, /Correct models sampled: 1\/20/u);
  assert.match(brief, /Ready to transfer: 1/u);
  assert.match(brief, /Repair first: 1/u);
  assert.match(
    brief,
    /Connected repair queue \(inside the canonical route\):/u,
  );
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
