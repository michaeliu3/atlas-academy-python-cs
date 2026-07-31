import assert from "node:assert/strict";
import test from "node:test";

import {
  MODULE27_PROGRESS_STORAGE_KEY,
  clearModule27Progress,
  module27ProgressCodec,
  persistModule27Progress,
  restoreModule27Progress,
} from "../lib/module27-progress-codec.js";
import {
  MODULE28_PROGRESS_STORAGE_KEY,
  clearModule28Progress,
  module28ProgressCodec,
  persistModule28Progress,
  restoreModule28Progress,
} from "../lib/module28-progress-codec.js";
import {
  MODULE29_PROGRESS_STORAGE_KEY,
  clearModule29Progress,
  module29ProgressCodec,
  persistModule29Progress,
  restoreModule29Progress,
} from "../lib/module29-progress-codec.js";
import {
  MODULE30_PROGRESS_STORAGE_KEY,
  clearModule30Progress,
  module30ProgressCodec,
  persistModule30Progress,
  restoreModule30Progress,
} from "../lib/module30-progress-codec.js";

function createMemoryStorage(initial = {}) {
  const entries = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return entries.get(key) ?? null;
    },
    setItem(key, value) {
      entries.set(key, value);
    },
    removeItem(key) {
      entries.delete(key);
    },
  };
}

const modules = [
  {
    label: "M27",
    storageKey: MODULE27_PROGRESS_STORAGE_KEY,
    expectedStorageKey: "atlas.module27.proof-counterexample-studio.v1",
    codec: module27ProgressCodec,
    restore: restoreModule27Progress,
    persist: persistModule27Progress,
    clear: clearModule27Progress,
    completeRecord: {
      scope: { choice: "forall-exists", confidence: 4, revealed: true },
      proof: { choice: "base", confidence: 3, revealed: false },
      invariant: { choice: "obligations", confidence: 2, revealed: false },
      count: { choice: "partition", confidence: 1, revealed: false },
      graph: { choice: "maximal", confidence: 2, revealed: false },
      order: { choice: "every-pair", confidence: 3, revealed: false },
    },
  },
  {
    label: "M28",
    storageKey: MODULE28_PROGRESS_STORAGE_KEY,
    expectedStorageKey: "atlas.module28.linear-algebra-stability-studio.v1",
    codec: module28ProgressCodec,
    restore: restoreModule28Progress,
    persist: persistModule28Progress,
    clear: clearModule28Progress,
    completeRecord: {
      space: { choice: "not-subspace", confidence: 4, revealed: true },
      map: { choice: "kernel", confidence: 3, revealed: false },
      projection: { choice: "columns", confidence: 2, revealed: false },
      spectrum: { choice: "orthogonal-eigenbasis", confidence: 1, revealed: false },
      stability: { choice: "sensitivity", confidence: 2, revealed: false },
      pca: { choice: "named-loss", confidence: 3, revealed: false },
    },
  },
  {
    label: "M29",
    storageKey: MODULE29_PROGRESS_STORAGE_KEY,
    expectedStorageKey: "atlas.module29.continuous-change-studio.v1",
    codec: module29ProgressCodec,
    restore: restoreModule29Progress,
    persist: persistModule29Progress,
    clear: clearModule29Progress,
    completeRecord: {
      limit: { choice: "removable", confidence: 4, revealed: true },
      local: { choice: "forward-boundary", confidence: 3, revealed: false },
      area: { choice: "absolute-determinant", confidence: 2, revealed: false },
      chain: { choice: "row-gradient", confidence: 1, revealed: false },
      convergence: { choice: "pointwise-not-uniform", confidence: 2, revealed: false },
      trajectory: { choice: "candidate-not-certificate", confidence: 3, revealed: false },
    },
  },
  {
    label: "M30",
    storageKey: MODULE30_PROGRESS_STORAGE_KEY,
    expectedStorageKey: "atlas.module30.probability-inference-studio.v1",
    codec: module30ProgressCodec,
    restore: restoreModule30Progress,
    persist: persistModule30Progress,
    clear: clearModule30Progress,
    completeRecord: {
      "base-rate": { choice: "conditional-update", confidence: 4, revealed: true },
      variation: { choice: "same-mean-different-risk", confidence: 3, revealed: false },
      repetition: { choice: "finite-not-theorem", confidence: 2, revealed: false },
      likelihood: { choice: "prior-changes-posterior", confidence: 1, revealed: false },
      procedure: { choice: "procedure-meaning", confidence: 2, revealed: false },
      design: { choice: "assignment-and-observation", confidence: 3, revealed: false },
    },
  },
];

for (
  const {
    label,
    storageKey,
    expectedStorageKey,
    codec,
    restore,
    persist,
    clear,
    completeRecord,
  } of modules
) {
  test(`${label} retains only a v1 allowlisted prediction envelope`, () => {
    assert.equal(storageKey, expectedStorageKey);
    assert.deepEqual(JSON.parse(codec.serialize(completeRecord)), {
      version: 1,
      record: completeRecord,
    });

    const storage = createMemoryStorage({
      [storageKey]: codec.serialize(completeRecord),
    });
    assert.deepEqual(restore(storage), completeRecord);
  });

  test(`${label} clears blank and malformed current state without creating a fresh record`, () => {
    const blankRecord = Object.fromEntries(
      Object.keys(completeRecord).map((view) => [
        view,
        { choice: null, confidence: null, revealed: false },
      ]),
    );
    const blankStorage = createMemoryStorage({
      [storageKey]: codec.serialize(blankRecord),
    });
    assert.equal(restore(blankStorage), null);
    assert.equal(blankStorage.getItem(storageKey), null);

    const malformedStorage = createMemoryStorage({
      [storageKey]: JSON.stringify({
        version: 1,
        record: { ...completeRecord, bypass: true },
      }),
    });
    assert.equal(restore(malformedStorage), null);
    assert.equal(malformedStorage.getItem(storageKey), null);

    const freshStorage = createMemoryStorage();
    assert.equal(restore(freshStorage), null);
    assert.equal(persist(freshStorage, blankRecord), false);
    assert.equal(freshStorage.getItem(storageKey), null);
  });

  test(`${label} lets the learner clear saved prediction evidence`, () => {
    const storage = createMemoryStorage();
    assert.equal(persist(storage, completeRecord), true);
    assert.notEqual(storage.getItem(storageKey), null);

    clear(storage);
    assert.equal(storage.getItem(storageKey), null);
  });
}
