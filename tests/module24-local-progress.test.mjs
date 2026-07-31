import assert from "node:assert/strict";
import test from "node:test";

import {
  clearModule24Progress,
  hasModule24MeaningfulProgress,
  MODULE24_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE24_PROGRESS_STORAGE_KEY,
  module24ProgressCodec,
  parseModule24LegacyProgress,
  persistModule24Progress,
  restoreModule24Progress,
} from "../lib/module24-progress-codec.js";

const completeRecord = {
  contract: { choice: "semantic", confidence: 4, revealed: true },
  graph: { choice: "audit", confidence: 3, revealed: true },
  cycle: { choice: "model", confidence: 2, revealed: false },
  lens: { choice: "traced", confidence: 1, revealed: false },
  runtime: { choice: "pinned", confidence: 2, revealed: false },
  decision: { choice: "defer", confidence: 3, revealed: false },
};

const emptyRecord = {
  contract: { choice: null, confidence: null, revealed: false },
  graph: { choice: null, confidence: null, revealed: false },
  cycle: { choice: null, confidence: null, revealed: false },
  lens: { choice: null, confidence: null, revealed: false },
  runtime: { choice: null, confidence: null, revealed: false },
  decision: { choice: null, confidence: null, revealed: false },
};

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

test("M24 restores only its exact v2 envelope of prediction evidence", () => {
  const encoded = module24ProgressCodec.serialize(completeRecord);

  assert.deepEqual(JSON.parse(encoded), { version: 2, record: completeRecord });
  assert.deepEqual(module24ProgressCodec.parse(encoded), completeRecord);
});

test("M24 rejects untrusted v2 progress that expands, confuses, or bypasses the prediction gate", () => {
  const bareRecord = JSON.stringify(completeRecord);
  const extraView = JSON.stringify({
    version: 2,
    record: { ...completeRecord, bypass: { choice: "invented", confidence: 4, revealed: true } },
  });
  const extraEntryField = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      contract: { ...completeRecord.contract, retain: true },
    },
  });
  const typeConfusedChoice = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      contract: { choice: ["semantic"], confidence: 4, revealed: true },
    },
  });
  const forgedReveal = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      decision: { choice: null, confidence: null, revealed: true },
    },
  });

  assert.equal(module24ProgressCodec.parse(bareRecord), null);
  assert.equal(module24ProgressCodec.parse(extraView), null);
  assert.equal(module24ProgressCodec.parse(extraEntryField), null);
  assert.equal(module24ProgressCodec.parse(typeConfusedChoice), null);
  assert.equal(module24ProgressCodec.parse(forgedReveal), null);
});

test("M24 migrates only an exact legacy record and refuses malformed legacy state", () => {
  assert.deepEqual(
    parseModule24LegacyProgress(JSON.stringify(completeRecord)),
    completeRecord,
  );
  assert.equal(
    parseModule24LegacyProgress(
      JSON.stringify({
        ...completeRecord,
        runtime: { ...completeRecord.runtime, unexpected: "persist me" },
      }),
    ),
    null,
  );
  assert.equal(
    parseModule24LegacyProgress(
      JSON.stringify({
        ...completeRecord,
        decision: { choice: null, confidence: null, revealed: true },
      }),
    ),
    null,
  );
});

test("M24 keeps blank local progress absent on a fresh visit and after reset", () => {
  const storage = createMemoryStorage({
    [MODULE24_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(completeRecord),
    [MODULE24_PROGRESS_STORAGE_KEY]: module24ProgressCodec.serialize(completeRecord),
  });

  assert.equal(hasModule24MeaningfulProgress(emptyRecord), false);
  assert.equal(persistModule24Progress(storage, emptyRecord), false);
  assert.deepEqual(storage.operations, []);

  clearModule24Progress(storage);
  assert.equal(storage.read(MODULE24_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(MODULE24_PROGRESS_STORAGE_KEY), null);
});

test("M24 removes a blank legacy shell without manufacturing a v2 default", () => {
  const storage = createMemoryStorage({
    [MODULE24_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(emptyRecord),
  });

  assert.equal(restoreModule24Progress(storage), null);
  assert.equal(storage.read(MODULE24_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(MODULE24_PROGRESS_STORAGE_KEY), null);
  assert.deepEqual(
    storage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", MODULE24_PROGRESS_STORAGE_KEY],
      ["get", MODULE24_LEGACY_PROGRESS_STORAGE_KEY],
      ["remove", MODULE24_LEGACY_PROGRESS_STORAGE_KEY],
    ],
  );
});

test("M24 removes a blank current v2 shell without reviving legacy progress", () => {
  const storage = createMemoryStorage({
    [MODULE24_PROGRESS_STORAGE_KEY]: module24ProgressCodec.serialize(emptyRecord),
    [MODULE24_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(completeRecord),
  });

  assert.equal(restoreModule24Progress(storage), null);
  assert.equal(storage.read(MODULE24_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(MODULE24_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.deepEqual(
    storage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", MODULE24_PROGRESS_STORAGE_KEY],
      ["remove", MODULE24_PROGRESS_STORAGE_KEY],
      ["remove", MODULE24_LEGACY_PROGRESS_STORAGE_KEY],
    ],
  );
});

test("M24 preserves a meaningful legacy migration and fails closed on a present malformed v2 record", () => {
  const migrationStorage = createMemoryStorage({
    [MODULE24_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(completeRecord),
  });

  assert.deepEqual(restoreModule24Progress(migrationStorage), completeRecord);
  assert.deepEqual(
    migrationStorage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", MODULE24_PROGRESS_STORAGE_KEY],
      ["get", MODULE24_LEGACY_PROGRESS_STORAGE_KEY],
      ["set", MODULE24_PROGRESS_STORAGE_KEY],
      ["remove", MODULE24_LEGACY_PROGRESS_STORAGE_KEY],
    ],
  );
  assert.deepEqual(
    module24ProgressCodec.parse(
      migrationStorage.read(MODULE24_PROGRESS_STORAGE_KEY),
    ),
    completeRecord,
  );

  const malformedCurrent = JSON.stringify(completeRecord);
  const malformedStorage = createMemoryStorage({
    [MODULE24_PROGRESS_STORAGE_KEY]: malformedCurrent,
    [MODULE24_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(completeRecord),
  });

  assert.equal(restoreModule24Progress(malformedStorage), null);
  assert.equal(
    malformedStorage.read(MODULE24_PROGRESS_STORAGE_KEY),
    malformedCurrent,
  );
  assert.equal(
    malformedStorage.read(MODULE24_LEGACY_PROGRESS_STORAGE_KEY), JSON.stringify(completeRecord));
});
