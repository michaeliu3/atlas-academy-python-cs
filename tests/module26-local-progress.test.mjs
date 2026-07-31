import assert from "node:assert/strict";
import test from "node:test";

import {
  clearModule26Progress,
  hasModule26MeaningfulProgress,
  module26ProgressCodec,
  parseModule26LegacyProgress,
  persistModule26Progress,
  restoreModule26Progress,
} from "../lib/module26-progress-codec.js";

const completeRecord = {
  brief: { choice: "bounded", confidence: 4, revealed: true },
  threads: { choice: "trace", confidence: 3, revealed: true },
  failure: { choice: "idempotent", confidence: 2, revealed: false },
  patch: { choice: "review", confidence: 1, revealed: false },
  ledger: { choice: "scoped", confidence: 2, revealed: false },
  board: { choice: "defer", confidence: 3, revealed: false },
};

const emptyRecord = {
  brief: { choice: null, confidence: null, revealed: false },
  threads: { choice: null, confidence: null, revealed: false },
  failure: { choice: null, confidence: null, revealed: false },
  patch: { choice: null, confidence: null, revealed: false },
  ledger: { choice: null, confidence: null, revealed: false },
  board: { choice: null, confidence: null, revealed: false },
};

test("M26 restores only its exact v2 envelope of prediction evidence", () => {
  const encoded = module26ProgressCodec.serialize(completeRecord);

  assert.deepEqual(JSON.parse(encoded), { version: 2, record: completeRecord });
  assert.deepEqual(module26ProgressCodec.parse(encoded), completeRecord);
});

test("M26 rejects untrusted current progress that expands, confuses, or bypasses prediction", () => {
  const bareLegacyShape = JSON.stringify(completeRecord);
  const extraView = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      bypass: { choice: "invented", confidence: 4, revealed: true },
    },
  });
  const extraEntryField = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      brief: { ...completeRecord.brief, retain: true },
    },
  });
  const typeConfusedChoice = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      brief: { choice: ["bounded"], confidence: 4, revealed: true },
    },
  });
  const forgedReveal = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      board: { choice: null, confidence: null, revealed: true },
    },
  });

  assert.equal(module26ProgressCodec.parse(bareLegacyShape), null);
  assert.equal(module26ProgressCodec.parse(extraView), null);
  assert.equal(module26ProgressCodec.parse(extraEntryField), null);
  assert.equal(module26ProgressCodec.parse(typeConfusedChoice), null);
  assert.equal(module26ProgressCodec.parse(forgedReveal), null);
});

test("M26 migrates only an exact legacy prediction record", () => {
  assert.deepEqual(
    parseModule26LegacyProgress(JSON.stringify(completeRecord)),
    completeRecord,
  );
  assert.equal(
    parseModule26LegacyProgress(
      JSON.stringify({
        ...completeRecord,
        ledger: { ...completeRecord.ledger, unexpected: "persist me" },
      }),
    ),
    null,
  );
  assert.equal(
    parseModule26LegacyProgress(
      JSON.stringify({
        ...completeRecord,
        board: { choice: null, confidence: null, revealed: true },
      }),
    ),
    null,
  );
});

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

test("M26 restores a valid v2 record without consulting legacy progress", () => {
  const current = module26ProgressCodec.serialize(completeRecord);
  const storage = createMemoryStorage({
    "atlas-academy.module26-capstone-defense.v2": current,
    "atlas-academy.module26-capstone-defense.v1": JSON.stringify(completeRecord),
  });

  assert.deepEqual(restoreModule26Progress(storage), completeRecord);
  assert.deepEqual(storage.operations, [
    ["get", "atlas-academy.module26-capstone-defense.v2"],
  ]);
});

test("M26 removes an empty current v2 shell and legacy state without reviving it", () => {
  const storage = createMemoryStorage({
    "atlas-academy.module26-capstone-defense.v2": module26ProgressCodec.serialize(emptyRecord),
    "atlas-academy.module26-capstone-defense.v1": JSON.stringify(completeRecord),
  });

  assert.equal(restoreModule26Progress(storage), null);
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v2"),
    null,
  );
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v1"),
    null,
  );
  assert.deepEqual(
    storage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", "atlas-academy.module26-capstone-defense.v2"],
      ["remove", "atlas-academy.module26-capstone-defense.v2"],
      ["remove", "atlas-academy.module26-capstone-defense.v1"],
    ],
  );
});

test("M26 migrates only when v2 is absent, writes v2 before removing legacy, and clears both on reset", () => {
  const storage = createMemoryStorage({
    "atlas-academy.module26-capstone-defense.v1": JSON.stringify(completeRecord),
  });

  assert.deepEqual(restoreModule26Progress(storage), completeRecord);
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v1"),
    null,
  );
  assert.deepEqual(
    module26ProgressCodec.parse(
      storage.read("atlas-academy.module26-capstone-defense.v2"),
    ),
    completeRecord,
  );
  assert.deepEqual(
    storage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", "atlas-academy.module26-capstone-defense.v2"],
      ["get", "atlas-academy.module26-capstone-defense.v1"],
      ["set", "atlas-academy.module26-capstone-defense.v2"],
      ["remove", "atlas-academy.module26-capstone-defense.v1"],
    ],
  );

  clearModule26Progress(storage);
  assert.equal(storage.read("atlas-academy.module26-capstone-defense.v2"), null);
  assert.equal(storage.read("atlas-academy.module26-capstone-defense.v1"), null);
});

test("M26 leaves malformed present v2 state untouched and refuses a legacy fallback", () => {
  const malformedCurrent = JSON.stringify(completeRecord);
  const legacyRecord = JSON.stringify(completeRecord);
  const storage = createMemoryStorage({
    "atlas-academy.module26-capstone-defense.v2": malformedCurrent,
    "atlas-academy.module26-capstone-defense.v1": legacyRecord,
  });

  assert.equal(restoreModule26Progress(storage), null);
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v2"),
    malformedCurrent,
  );
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v1"),
    legacyRecord,
  );
  assert.deepEqual(storage.operations, [
    ["get", "atlas-academy.module26-capstone-defense.v2"],
  ]);
});

test("M26 removes a blank legacy shell without creating an empty v2 envelope", () => {
  const storage = createMemoryStorage({
    "atlas-academy.module26-capstone-defense.v1": JSON.stringify(emptyRecord),
  });

  assert.equal(restoreModule26Progress(storage), null);
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v1"),
    null,
  );
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v2"),
    null,
  );
  assert.deepEqual(
    storage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", "atlas-academy.module26-capstone-defense.v2"],
      ["get", "atlas-academy.module26-capstone-defense.v1"],
      ["remove", "atlas-academy.module26-capstone-defense.v1"],
    ],
  );
});

test("M26 persists only meaningful prediction evidence and leaves a blank visit or reset absent", () => {
  const storage = createMemoryStorage();
  const selectedRecord = {
    ...emptyRecord,
    brief: { choice: "bounded", confidence: null, revealed: false },
  };

  assert.equal(hasModule26MeaningfulProgress(emptyRecord), false);
  assert.equal(hasModule26MeaningfulProgress(selectedRecord), true);
  assert.equal(persistModule26Progress(storage, emptyRecord), false);
  assert.deepEqual(storage.operations, []);
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v2"),
    null,
  );
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v1"),
    null,
  );

  assert.equal(persistModule26Progress(storage, selectedRecord), true);
  assert.deepEqual(
    module26ProgressCodec.parse(
      storage.read("atlas-academy.module26-capstone-defense.v2"),
    ),
    selectedRecord,
  );

  clearModule26Progress(storage);
  assert.equal(persistModule26Progress(storage, emptyRecord), false);
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v2"),
    null,
  );
  assert.equal(
    storage.read("atlas-academy.module26-capstone-defense.v1"),
    null,
  );
});
