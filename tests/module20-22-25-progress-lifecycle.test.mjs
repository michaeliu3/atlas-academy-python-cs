import assert from "node:assert/strict";
import test from "node:test";

import {
  clearModule20Progress,
  MODULE20_PROGRESS_STORAGE_KEY,
  module20ProgressCodec,
  persistModule20Progress,
  restoreModule20Progress,
} from "../lib/module20-progress-codec.js";
import {
  clearModule21Progress,
  MODULE21_PROGRESS_STORAGE_KEY,
  module21ProgressCodec,
  persistModule21Progress,
  restoreModule21Progress,
} from "../lib/module21-progress-codec.js";
import {
  clearModule22Progress,
  MODULE22_PROGRESS_STORAGE_KEY,
  module22ProgressCodec,
  persistModule22Progress,
  restoreModule22Progress,
} from "../lib/module22-progress-codec.js";
import {
  clearModule25Progress,
  MODULE25_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE25_PROGRESS_STORAGE_KEY,
  module25ProgressCodec,
  persistModule25Progress,
  restoreModule25Progress,
} from "../lib/module25-progress-codec.js";

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
    read(key) {
      return values.get(key) ?? null;
    },
  };
}

const surfaces = [
  {
    label: "M20",
    storageKey: MODULE20_PROGRESS_STORAGE_KEY,
    codec: module20ProgressCodec,
    restore: restoreModule20Progress,
    persist: persistModule20Progress,
    clear: clearModule20Progress,
    record: {
      naming: { choice: "candidate", confidence: 4, revealed: true },
      framing: { choice: "frame", confidence: 3, revealed: false },
      evidence: { choice: "unknown", confidence: 2, revealed: false },
      http: { choice: "atlas", confidence: 1, revealed: false },
      retry: { choice: "same", confidence: 2, revealed: false },
      audit: { choice: "timeout", confidence: 3, revealed: false },
    },
    blank: {
      naming: { choice: null, confidence: null, revealed: false },
      framing: { choice: null, confidence: null, revealed: false },
      evidence: { choice: null, confidence: null, revealed: false },
      http: { choice: null, confidence: null, revealed: false },
      retry: { choice: null, confidence: null, revealed: false },
      audit: { choice: null, confidence: null, revealed: false },
    },
  },
  {
    label: "M21",
    storageKey: MODULE21_PROGRESS_STORAGE_KEY,
    codec: module21ProgressCodec,
    restore: restoreModule21Progress,
    persist: persistModule21Progress,
    clear: clearModule21Progress,
    record: {
      task: { choice: "owned", confidence: 4, revealed: true },
      scope: { choice: "scope", confidence: 3, revealed: false },
      pressure: { choice: "slot", confidence: 2, revealed: false },
      reconcile: { choice: "same", confidence: 1, revealed: false },
      order: { choice: "local", confidence: 2, revealed: false },
      audit: { choice: "full", confidence: 3, revealed: false },
    },
    blank: {
      task: { choice: null, confidence: null, revealed: false },
      scope: { choice: null, confidence: null, revealed: false },
      pressure: { choice: null, confidence: null, revealed: false },
      reconcile: { choice: null, confidence: null, revealed: false },
      order: { choice: null, confidence: null, revealed: false },
      audit: { choice: null, confidence: null, revealed: false },
    },
  },
  {
    label: "M22",
    storageKey: MODULE22_PROGRESS_STORAGE_KEY,
    codec: module22ProgressCodec,
    restore: restoreModule22Progress,
    persist: persistModule22Progress,
    clear: clearModule22Progress,
    record: {
      boundary: { choice: "correlation", confidence: 4, revealed: true },
      identity: { choice: "tuple", confidence: 3, revealed: false },
      pipeline: { choice: "sink", confidence: 2, revealed: false },
      crypto: { choice: "narrow", confidence: 1, revealed: false },
      provenance: { choice: "gap", confidence: 2, revealed: false },
      incident: { choice: "unknown", confidence: 3, revealed: false },
    },
    blank: {
      boundary: { choice: null, confidence: null, revealed: false },
      identity: { choice: null, confidence: null, revealed: false },
      pipeline: { choice: null, confidence: null, revealed: false },
      crypto: { choice: null, confidence: null, revealed: false },
      provenance: { choice: null, confidence: null, revealed: false },
      incident: { choice: null, confidence: null, revealed: false },
    },
  },
  {
    label: "M25",
    storageKey: MODULE25_PROGRESS_STORAGE_KEY,
    codec: module25ProgressCodec,
    restore: restoreModule25Progress,
    persist: persistModule25Progress,
    clear: clearModule25Progress,
    retiredStorageKey: MODULE25_LEGACY_PROGRESS_STORAGE_KEY,
    record: {
      purpose: { choice: "optional", confidence: 4, revealed: true },
      lineage: { choice: "before", confidence: 3, revealed: false },
      ranking: { choice: "set", confidence: 2, revealed: false },
      evaluation: { choice: "bounded", confidence: 1, revealed: false },
      control: { choice: "person", confidence: 2, revealed: false },
      agent: { choice: "proposal", confidence: 3, revealed: false },
    },
    blank: {
      purpose: { choice: null, confidence: null, revealed: false },
      lineage: { choice: null, confidence: null, revealed: false },
      ranking: { choice: null, confidence: null, revealed: false },
      evaluation: { choice: null, confidence: null, revealed: false },
      control: { choice: null, confidence: null, revealed: false },
      agent: { choice: null, confidence: null, revealed: false },
    },
  },
];

for (const surface of surfaces) {
  test(`${surface.label} restores its declared bounded prediction evidence`, () => {
    const encoded = surface.codec.serialize(surface.record);
    const storage = createMemoryStorage({
      [surface.storageKey]: encoded,
      ...(surface.retiredStorageKey
        ? { [surface.retiredStorageKey]: JSON.stringify({ stale: true }) }
        : {}),
    });

    assert.deepEqual(JSON.parse(encoded), {
      version: surface.codec.version,
      record: surface.record,
    });
    assert.deepEqual(surface.restore(storage), surface.record);
    assert.deepEqual(surface.codec.parse(storage.read(surface.storageKey)), surface.record);
    if (surface.retiredStorageKey) {
      assert.equal(storage.read(surface.retiredStorageKey), null);
    }
  });

  test(`${surface.label} clears malformed, blank, and reset prediction evidence without writing a default envelope`, () => {
    const freshStorage = createMemoryStorage();
    assert.equal(surface.restore(freshStorage), null);
    assert.equal(surface.persist(freshStorage, surface.blank), false);
    assert.equal(freshStorage.read(surface.storageKey), null);

    const storage = createMemoryStorage({
      [surface.storageKey]: "malformed current progress",
      ...(surface.retiredStorageKey
        ? { [surface.retiredStorageKey]: JSON.stringify({ stale: true }) }
        : {}),
    });

    assert.equal(surface.restore(storage), null);
    assert.equal(storage.read(surface.storageKey), null);
    if (surface.retiredStorageKey) {
      assert.equal(storage.read(surface.retiredStorageKey), null);
    }

    assert.equal(surface.persist(storage, surface.blank), false);
    assert.equal(storage.read(surface.storageKey), null);

    assert.equal(surface.persist(storage, surface.record), true);
    surface.clear(storage);
    assert.equal(storage.read(surface.storageKey), null);
    if (surface.retiredStorageKey) {
      assert.equal(storage.read(surface.retiredStorageKey), null);
    }
  });
}

test("M25 explicitly retires an otherwise valid-looking v1 envelope without reviving it", () => {
  const m25 = surfaces.find((surface) => surface.label === "M25");
  assert.ok(m25);
  const storage = createMemoryStorage({
    [MODULE25_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({
      version: 1,
      record: m25.record,
    }),
  });

  assert.equal(restoreModule25Progress(storage), null);
  assert.equal(storage.read(MODULE25_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(MODULE25_PROGRESS_STORAGE_KEY), null);
});
