import assert from "node:assert/strict";
import test from "node:test";

import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
  createVersionedProgressCodec,
} from "../lib/local-progress-codec.js";

const codec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["scope", "proof"],
  choiceIdsByView: {
    scope: ["forall-exists", "exists-forall"],
    proof: ["base", "samples"],
  },
});

const completeRecord = {
  scope: { choice: "forall-exists", confidence: 3, revealed: true },
  proof: { choice: "base", confidence: 1, revealed: false },
};

function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    read(key) {
      return data.get(key) ?? null;
    },
  };
}

test("the local progress codec round-trips only a versioned allowlisted prediction record", () => {
  const encoded = codec.serialize(completeRecord);

  assert.deepEqual(JSON.parse(encoded), {
    version: 1,
    record: completeRecord,
  });
  assert.deepEqual(codec.parse(encoded), completeRecord);
});

test("the local progress codec rejects a forged reveal without a recorded prediction and confidence", () => {
  const forged = JSON.stringify({
    version: 1,
    record: {
      scope: { choice: null, confidence: null, revealed: true },
      proof: { choice: "base", confidence: 1, revealed: false },
    },
  });

  assert.equal(codec.parse(forged), null);
});

test("the local progress codec rejects unknown choices, unknown views, and a stale version", () => {
  const unknownChoice = JSON.stringify({
    version: 1,
    record: {
      scope: { choice: "invented-answer", confidence: 2, revealed: true },
      proof: { choice: "base", confidence: 1, revealed: false },
    },
  });
  const unknownView = JSON.stringify({
    version: 1,
    record: { ...completeRecord, bypass: { choice: "anything", confidence: 4, revealed: true } },
  });
  const staleVersion = JSON.stringify({ version: 0, record: completeRecord });

  assert.equal(codec.parse(unknownChoice), null);
  assert.equal(codec.parse(unknownView), null);
  assert.equal(codec.parse(staleVersion), null);
});

test("the local progress codec validates a single reveal checkpoint for a composite studio", () => {
  assert.deepEqual(
    codec.parseEntry("scope", {
      choice: "forall-exists",
      confidence: 4,
      revealed: true,
    }),
    { choice: "forall-exists", confidence: 4, revealed: true },
  );
  assert.equal(
    codec.parseEntry("scope", {
      choice: "invented-answer",
      confidence: 4,
      revealed: true,
    }),
    null,
  );
});

test("the local progress codec can allowlist fixed string confidence labels", () => {
  const intakeCodec = createPredictionProgressCodec({
    version: 3,
    viewIds: ["python-model"],
    choiceIdsByView: { "python-model": ["A", "B", "C", "D"] },
    confidenceLevels: ["low", "medium", "high"],
  });
  const record = {
    "python-model": { choice: "C", confidence: "medium", revealed: true },
  };

  assert.deepEqual(intakeCodec.parse(intakeCodec.serialize(record)), record);
  assert.equal(
    intakeCodec.parse(
      JSON.stringify({
        version: 3,
        record: {
          "python-model": { choice: "C", confidence: 3, revealed: true },
        },
      }),
    ),
    null,
  );
});

test("the shared envelope codec rejects expanded records through a module-defined normalizer", () => {
  const checkpointCodec = createVersionedProgressCodec({
    version: 7,
    normalizeRecord(value) {
      if (
        value === null ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.keys(value).length !== 1 ||
        !Object.hasOwn(value, "step") ||
        !Number.isInteger(value.step) ||
        value.step < 0 ||
        value.step > 4
      ) {
        return null;
      }
      return { step: value.step };
    },
  });

  assert.deepEqual(
    checkpointCodec.parse(checkpointCodec.serialize({ step: 3 })),
    { step: 3 },
  );
  assert.equal(
    checkpointCodec.parse(
      JSON.stringify({ version: 7, record: { step: 3, bypass: true } }),
    ),
    null,
  );
});

test("a prediction lifecycle keeps only meaningful current evidence and retires stale keys", () => {
  const lifecycle = createPredictionProgressLifecycle({
    storageKey: "atlas-academy.example.v2",
    codec,
    retiredStorageKeys: ["atlas.example.v1"],
  });
  const storage = createMemoryStorage({
    "atlas.example.v1": JSON.stringify(completeRecord),
  });
  const emptyRecord = {
    scope: { choice: null, confidence: null, revealed: false },
    proof: { choice: null, confidence: null, revealed: false },
  };

  assert.equal(lifecycle.persist(storage, emptyRecord), false);
  assert.equal(storage.read("atlas-academy.example.v2"), null);
  assert.equal(storage.read("atlas.example.v1"), null);

  assert.equal(lifecycle.persist(storage, completeRecord), true);
  assert.deepEqual(lifecycle.restore(storage), completeRecord);

  storage.setItem("atlas-academy.example.v2", "malformed");
  storage.setItem("atlas.example.v1", JSON.stringify(completeRecord));
  assert.equal(lifecycle.restore(storage), null);
  assert.equal(storage.read("atlas-academy.example.v2"), null);
  assert.equal(storage.read("atlas.example.v1"), null);

  lifecycle.persist(storage, completeRecord);
  lifecycle.clear(storage);
  assert.equal(storage.read("atlas-academy.example.v2"), null);
});

test("a prediction lifecycle reports denied writes and attempts every declared cleanup key", () => {
  const lifecycle = createPredictionProgressLifecycle({
    storageKey: "atlas-academy.example.v2",
    codec,
    retiredStorageKeys: ["atlas.example.v1"],
  });
  const operations = [];
  const storage = {
    setItem(key) {
      operations.push(["set", key]);
      return false;
    },
    removeItem(key) {
      operations.push(["remove", key]);
      return false;
    },
  };

  assert.equal(lifecycle.persist(storage, completeRecord), false);
  assert.deepEqual(operations, [["set", "atlas-academy.example.v2"]]);

  assert.equal(lifecycle.clear(storage), false);
  assert.deepEqual(operations, [
    ["set", "atlas-academy.example.v2"],
    ["remove", "atlas-academy.example.v2"],
    ["remove", "atlas.example.v1"],
  ]);
});
