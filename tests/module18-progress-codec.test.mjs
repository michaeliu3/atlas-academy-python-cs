import assert from "node:assert/strict";
import test from "node:test";

import {
  clearModule18Progress,
  hasMeaningfulModule18Progress,
  MODULE18_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE18_PROGRESS_STORAGE_KEY,
  module18ProgressCodec,
  parseBoundedHexadecimal,
  persistModule18Progress,
  restoreModule18Progress,
} from "../lib/module18-progress-codec.js";

const completeRecord = {
  boundary: {
    step: 2,
    choice: "crossing",
    confidence: 4,
    revealed: true,
  },
  translation: {
    process: "B",
    virtualAddress: 0x2a3f,
    access: "write",
    pte: {
      valid: true,
      present: true,
      frame: 0x52,
      permissions: "r-x",
      fileBacked: false,
    },
    vpn: 0x2a,
    offset: 0x3f,
    outcome: "protection",
    physical: null,
    confidence: 3,
    revealed: true,
  },
  publication: {
    scenario: "abrupt",
    phase: 8,
    choice: "unknown",
    confidence: 2,
    revealed: true,
  },
};

const emptyRecord = {
  boundary: { step: 0, choice: null, confidence: null, revealed: false },
  translation: {
    process: "A",
    virtualAddress: 0x2a3f,
    access: "read",
    pte: {
      valid: true,
      present: true,
      frame: 0x91,
      permissions: "rw-",
      fileBacked: false,
    },
    vpn: null,
    offset: null,
    outcome: null,
    physical: null,
    confidence: null,
    revealed: false,
  },
  publication: {
    scenario: "normal",
    phase: 0,
    choice: null,
    confidence: null,
    revealed: false,
  },
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

test("M18 accepts only its v3 context-bound prediction evidence", () => {
  const encoded = module18ProgressCodec.serialize(completeRecord);

  assert.equal(MODULE18_PROGRESS_STORAGE_KEY.endsWith(".v3"), true);
  assert.deepEqual(JSON.parse(encoded), { version: 3, record: completeRecord });
  assert.deepEqual(module18ProgressCodec.parse(encoded), completeRecord);
});

test("M18 rejects record expansion, forged translation reveal, and partial hexadecimal text", () => {
  const expanded = {
    ...completeRecord,
    translation: { ...completeRecord.translation, freeText: "retain this" },
  };
  const forgedReveal = {
    ...completeRecord,
    translation: {
      ...completeRecord.translation,
      outcome: "mapped",
      physical: null,
    },
  };

  assert.equal(
    module18ProgressCodec.parse(
      JSON.stringify({ version: 3, record: expanded }),
    ),
    null,
  );
  assert.equal(
    module18ProgressCodec.parse(
      JSON.stringify({ version: 3, record: forgedReveal }),
    ),
    null,
  );
  assert.equal(parseBoundedHexadecimal("2Agarbage", 0xff), null);
  assert.equal(parseBoundedHexadecimal("0x10000", 0xffff), null);
  assert.equal(parseBoundedHexadecimal("0x2A", 0xff), 0x2a);
});

test("M18 retires broad v2 state, leaves blank progress absent, and clears stale evidence", () => {
  const retiredStorage = createMemoryStorage({
    [MODULE18_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({
      activeView: "memory",
      vmPredictedVpn: "2Agarbage",
    }),
  });

  assert.equal(restoreModule18Progress(retiredStorage), null);
  assert.equal(retiredStorage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY), null);
  assert.equal(retiredStorage.read(MODULE18_PROGRESS_STORAGE_KEY), null);

  const blankStorage = createMemoryStorage();
  assert.equal(hasMeaningfulModule18Progress(emptyRecord), false);
  assert.equal(persistModule18Progress(blankStorage, emptyRecord), false);
  assert.equal(blankStorage.read(MODULE18_PROGRESS_STORAGE_KEY), null);
  assert.equal(blankStorage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY), null);

  const staleStorage = createMemoryStorage({
    [MODULE18_PROGRESS_STORAGE_KEY]: module18ProgressCodec.serialize(
      completeRecord,
    ),
    [MODULE18_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({ broad: true }),
  });
  assert.equal(persistModule18Progress(staleStorage, emptyRecord), false);
  assert.equal(staleStorage.read(MODULE18_PROGRESS_STORAGE_KEY), null);
  assert.equal(staleStorage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY), null);
});

test("M18 resumes only valid v3 evidence and reset clears both generations", () => {
  const storage = createMemoryStorage({
    [MODULE18_PROGRESS_STORAGE_KEY]: module18ProgressCodec.serialize(
      completeRecord,
    ),
    [MODULE18_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({
      activeView: "shutdown",
    }),
  });

  assert.deepEqual(restoreModule18Progress(storage), completeRecord);
  assert.equal(storage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY), null);

  clearModule18Progress(storage);
  assert.equal(storage.read(MODULE18_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY), null);
});

test("M18 fails closed when a current v3 record is blank or malformed", () => {
  const blankCurrentStorage = createMemoryStorage({
    [MODULE18_PROGRESS_STORAGE_KEY]: module18ProgressCodec.serialize(emptyRecord),
    [MODULE18_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({ broad: true }),
  });
  const malformedCurrentStorage = createMemoryStorage({
    [MODULE18_PROGRESS_STORAGE_KEY]: JSON.stringify({
      version: 3,
      record: { ...completeRecord, bypass: true },
    }),
    [MODULE18_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({ broad: true }),
  });

  assert.equal(restoreModule18Progress(blankCurrentStorage), null);
  assert.equal(blankCurrentStorage.read(MODULE18_PROGRESS_STORAGE_KEY), null);
  assert.equal(
    blankCurrentStorage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY),
    null,
  );
  assert.equal(restoreModule18Progress(malformedCurrentStorage), null);
  assert.equal(malformedCurrentStorage.read(MODULE18_PROGRESS_STORAGE_KEY), null);
  assert.equal(
    malformedCurrentStorage.read(MODULE18_LEGACY_PROGRESS_STORAGE_KEY),
    null,
  );
});
