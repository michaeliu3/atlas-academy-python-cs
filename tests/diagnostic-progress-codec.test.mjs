import assert from "node:assert/strict";
import test from "node:test";

import {
  attemptToDiagnosticProgress,
  clearDiagnosticProgress,
  diagnosticProgressCodec,
  diagnosticProgressToAttempt,
  DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY,
  DIAGNOSTIC_PROGRESS_STORAGE_KEY,
  hasMeaningfulDiagnosticProgress,
  persistDiagnosticProgress,
  restoreDiagnosticProgress,
} from "../lib/diagnostic-progress-codec.js";
import {
  createEmptyAttempt,
  diagnosticQuestions,
} from "../lib/diagnostic-model.js";

function createMemoryStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  const operations = [];
  return {
    getItem(key) {
      operations.push(["get", key]);
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      operations.push(["set", key, value]);
      values.set(key, value);
    },
    removeItem(key) {
      operations.push(["remove", key]);
      values.delete(key);
    },
    read(key) {
      return values.has(key) ? values.get(key) : null;
    },
    operations,
  };
}

function validLegacyAttempt() {
  const [first, second] = diagnosticQuestions;
  return {
    ...createEmptyAttempt("2026-07-31T00:00:00.000Z"),
    currentQuestionId: second.id,
    responsesByQuestionId: {
      [first.id]: {
        optionId: first.correctOptionId,
        confidence: "high",
        revealed: true,
      },
      [second.id]: {
        optionId: second.options[0].id,
        revealed: false,
      },
    },
  };
}

test("the intake v3 record contains exactly the 20 fixed learner-evidence triads", () => {
  const first = diagnosticQuestions[0];
  const attempt = {
    ...createEmptyAttempt("2026-07-31T00:00:00.000Z"),
    responsesByQuestionId: {
      [first.id]: {
        optionId: "C",
        confidence: "medium",
        revealed: true,
      },
    },
  };
  const record = attemptToDiagnosticProgress(attempt);

  assert.equal(DIAGNOSTIC_PROGRESS_STORAGE_KEY.endsWith("-v3"), true);
  assert.deepEqual(Object.keys(record), diagnosticQuestions.map((question) => question.id));
  assert.deepEqual(record[first.id], {
    choice: "C",
    confidence: "medium",
    revealed: true,
  });
  assert.deepEqual(
    diagnosticProgressCodec.parse(diagnosticProgressCodec.serialize(record)),
    record,
  );
});

test("the intake v3 codec rejects expanded triads and forged reveals", () => {
  const record = attemptToDiagnosticProgress(validLegacyAttempt());
  const first = diagnosticQuestions[0];
  const expanded = {
    ...record,
    [first.id]: { ...record[first.id], note: "retain this" },
  };
  const forgedReveal = {
    ...record,
    [first.id]: { choice: null, confidence: null, revealed: true },
  };

  assert.equal(
    diagnosticProgressCodec.parse(
      JSON.stringify({ version: 3, record: expanded }),
    ),
    null,
  );
  assert.equal(
    diagnosticProgressCodec.parse(
      JSON.stringify({ version: 3, record: forgedReveal }),
    ),
    null,
  );
});

test("the intake projects a valid v2 attempt into v3 before retiring legacy state", () => {
  const legacyAttempt = validLegacyAttempt();
  const storage = createMemoryStorage({
    [DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(legacyAttempt),
  });

  const restored = restoreDiagnosticProgress(
    storage,
    "2026-07-31T01:00:00.000Z",
  );
  const record = attemptToDiagnosticProgress(legacyAttempt);

  assert.deepEqual(restored, {
    ...createEmptyAttempt("2026-07-31T01:00:00.000Z"),
    currentQuestionId: diagnosticQuestions[1].id,
    responsesByQuestionId: legacyAttempt.responsesByQuestionId,
    completed: false,
  });
  assert.deepEqual(
    diagnosticProgressCodec.parse(storage.read(DIAGNOSTIC_PROGRESS_STORAGE_KEY)),
    record,
  );
  assert.equal(storage.read(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.deepEqual(
    storage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", DIAGNOSTIC_PROGRESS_STORAGE_KEY],
      ["get", DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY],
      ["set", DIAGNOSTIC_PROGRESS_STORAGE_KEY],
      ["remove", DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY],
    ],
  );
});

test("the intake derives resume and completion state without persisting navigation or timestamps", () => {
  const record = attemptToDiagnosticProgress(validLegacyAttempt());
  const restored = diagnosticProgressToAttempt(
    record,
    "2026-07-31T02:00:00.000Z",
  );

  assert.equal(restored.currentQuestionId, diagnosticQuestions[1].id);
  assert.equal(restored.completed, false);
  assert.equal(restored.updatedAt, "2026-07-31T02:00:00.000Z");
  assert.deepEqual(
    Object.keys(restored.responsesByQuestionId),
    diagnosticQuestions.slice(0, 2).map((question) => question.id),
  );
});

test("the intake fails closed for blank or malformed current v3 state and does not create defaults", () => {
  const emptyAttempt = createEmptyAttempt("2026-07-31T00:00:00.000Z");
  const emptyRecord = attemptToDiagnosticProgress(emptyAttempt);
  const legacyAttempt = validLegacyAttempt();
  const blankStorage = createMemoryStorage({
    [DIAGNOSTIC_PROGRESS_STORAGE_KEY]: diagnosticProgressCodec.serialize(emptyRecord),
    [DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(legacyAttempt),
  });
  const malformedStorage = createMemoryStorage({
    [DIAGNOSTIC_PROGRESS_STORAGE_KEY]: JSON.stringify({
      version: 3,
      record: { ...emptyRecord, bypass: true },
    }),
    [DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(legacyAttempt),
  });
  const freshStorage = createMemoryStorage();

  assert.equal(hasMeaningfulDiagnosticProgress(emptyRecord), false);
  assert.equal(persistDiagnosticProgress(freshStorage, emptyAttempt), false);
  assert.deepEqual(freshStorage.operations, []);
  assert.equal(restoreDiagnosticProgress(blankStorage), null);
  assert.equal(blankStorage.read(DIAGNOSTIC_PROGRESS_STORAGE_KEY), null);
  assert.equal(blankStorage.read(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(restoreDiagnosticProgress(malformedStorage), null);
  assert.equal(malformedStorage.read(DIAGNOSTIC_PROGRESS_STORAGE_KEY), null);
  assert.equal(
    malformedStorage.read(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY),
    null,
  );
});

test("the intake reset removes both progress generations", () => {
  const storage = createMemoryStorage({
    [DIAGNOSTIC_PROGRESS_STORAGE_KEY]: diagnosticProgressCodec.serialize(
      attemptToDiagnosticProgress(validLegacyAttempt()),
    ),
    [DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(
      validLegacyAttempt(),
    ),
  });

  clearDiagnosticProgress(storage);
  assert.equal(storage.read(DIAGNOSTIC_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY), null);
});
