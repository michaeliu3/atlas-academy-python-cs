import assert from "node:assert/strict";
import test from "node:test";

import {
  clearModule19Progress,
  hasMeaningfulModule19Progress,
  MODULE19_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE19_PROGRESS_STORAGE_KEY,
  module19ProgressCodec,
  restoreModule19Progress,
} from "../lib/module19-progress-codec.js";

const completeRecord = {
  history: { choice: "lost", confidence: 4, revealed: true },
  linearization: { choice: "logical", confidence: 3, revealed: true },
  coordination: { choice: "unfinished", confidence: 2, revealed: false },
  progress: { choice: "declared", confidence: 1, revealed: false },
  models: { choice: "process", confidence: 2, revealed: false },
  evidence: { choice: "oracle", confidence: 3, revealed: false },
};

const emptyRecord = {
  history: { choice: null, confidence: null, revealed: false },
  linearization: { choice: null, confidence: null, revealed: false },
  coordination: { choice: null, confidence: null, revealed: false },
  progress: { choice: null, confidence: null, revealed: false },
  models: { choice: null, confidence: null, revealed: false },
  evidence: { choice: null, confidence: null, revealed: false },
};

function createMemoryStorage(initial = {}) {
  const entries = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return entries.has(key) ? entries.get(key) : null;
    },
    setItem(key, value) {
      entries.set(key, value);
    },
    removeItem(key) {
      entries.delete(key);
    },
  };
}

test("M19 persists exactly six allowlisted prediction gates in a fresh v3 envelope", () => {
  assert.equal(
    MODULE19_LEGACY_PROGRESS_STORAGE_KEY,
    "atlas-academy.module19-concurrency-studio.v2",
  );
  assert.equal(
    MODULE19_PROGRESS_STORAGE_KEY,
    "atlas-academy.module19-concurrency-studio.v3",
  );

  const encoded = module19ProgressCodec.serialize(completeRecord);
  assert.deepEqual(JSON.parse(encoded), { version: 3, record: completeRecord });
  assert.deepEqual(module19ProgressCodec.parse(encoded), completeRecord);
});

test("M19 rejects raw, stale, and expanded records instead of retaining learner context", () => {
  const rawRecord = JSON.stringify(completeRecord);
  const staleEnvelope = JSON.stringify({ version: 2, record: completeRecord });
  const expandedEnvelope = JSON.stringify({
    version: 3,
    record: completeRecord,
    activeView: "evidence",
  });
  const broadAnswer = JSON.stringify({
    version: 3,
    record: {
      ...completeRecord,
      history: {
        ...completeRecord.history,
        revision: "A private revision must never be retained.",
      },
    },
  });
  const syntheticHistory = JSON.stringify({
    version: 3,
    record: {
      ...completeRecord,
      syntheticHistory: ["A:R", "B:R"],
    },
  });

  assert.equal(module19ProgressCodec.parse(rawRecord), null);
  assert.equal(module19ProgressCodec.parse(staleEnvelope), null);
  assert.equal(module19ProgressCodec.parse(expandedEnvelope), null);
  assert.equal(module19ProgressCodec.parse(broadAnswer), null);
  assert.equal(module19ProgressCodec.parse(syntheticHistory), null);
});

test("M19 intentionally does not migrate its broad v2 record", () => {
  const legacyRecord = JSON.stringify({
    version: 2,
    activeView: "models",
    answers: completeRecord,
    record: { modelChoice: { candidate: "processes" } },
    misconceptions: ["History explorer"],
  });
  const storage = createMemoryStorage({
    [MODULE19_LEGACY_PROGRESS_STORAGE_KEY]: legacyRecord,
  });

  assert.equal(restoreModule19Progress(storage), null);
  assert.equal(storage.getItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.getItem(MODULE19_PROGRESS_STORAGE_KEY), null);
});

test("M19 discards a valid but blank v3 envelope without falling back to v2", () => {
  const storage = createMemoryStorage({
    [MODULE19_PROGRESS_STORAGE_KEY]: module19ProgressCodec.serialize(emptyRecord),
    [MODULE19_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({
      version: 2,
      activeView: "history",
      answers: completeRecord,
      record: { historySchedule: ["A", "B"] },
    }),
  });

  assert.equal(hasMeaningfulModule19Progress(emptyRecord), false);
  assert.equal(hasMeaningfulModule19Progress(completeRecord), true);
  assert.equal(restoreModule19Progress(storage), null);
  assert.equal(storage.getItem(MODULE19_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.getItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);
});

test("M19 fails closed on a malformed present v3 record and never falls back to broad v2", () => {
  const malformedCurrent = JSON.stringify({
    version: 3,
    record: {
      ...completeRecord,
      history: {
        ...completeRecord.history,
        revision: "must not become a current progress field",
      },
    },
  });
  const broadLegacy = JSON.stringify({
    version: 2,
    activeView: "models",
    answers: completeRecord,
    record: { modelChoice: { candidate: "processes" } },
    misconceptions: ["History explorer"],
  });
  const storage = createMemoryStorage({
    [MODULE19_PROGRESS_STORAGE_KEY]: malformedCurrent,
    [MODULE19_LEGACY_PROGRESS_STORAGE_KEY]: broadLegacy,
  });

  assert.equal(restoreModule19Progress(storage), null);
  assert.equal(storage.getItem(MODULE19_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.getItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);
});

test("M19 restores only a valid v3 record and reset removes both generations", () => {
  const storage = createMemoryStorage({
    [MODULE19_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({
      version: 2,
      record: { modelChoice: { candidate: "processes" } },
    }),
    [MODULE19_PROGRESS_STORAGE_KEY]: module19ProgressCodec.serialize(completeRecord),
  });

  assert.deepEqual(restoreModule19Progress(storage), completeRecord);
  assert.equal(storage.getItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.deepEqual(
    module19ProgressCodec.parse(storage.getItem(MODULE19_PROGRESS_STORAGE_KEY)),
    completeRecord,
  );

  clearModule19Progress(storage);
  assert.equal(storage.getItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.getItem(MODULE19_PROGRESS_STORAGE_KEY), null);
});
