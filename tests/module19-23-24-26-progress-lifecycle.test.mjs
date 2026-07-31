import assert from "node:assert/strict";
import test from "node:test";

import {
  MODULE19_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE19_PROGRESS_STORAGE_KEY,
  module19ProgressCodec,
  persistModule19Progress,
} from "../lib/module19-progress-codec.js";
import {
  MODULE23_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE23_PROGRESS_STORAGE_KEY,
  module23ProgressCodec,
  persistModule23Progress,
  restoreModule23Progress,
} from "../lib/module23-progress-codec.js";
import {
  MODULE24_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE24_PROGRESS_STORAGE_KEY,
  module24ProgressCodec,
  persistModule24Progress,
  restoreModule24Progress,
} from "../lib/module24-progress-codec.js";
import {
  MODULE26_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE26_PROGRESS_STORAGE_KEY,
  module26ProgressCodec,
  persistModule26Progress,
  restoreModule26Progress,
} from "../lib/module26-progress-codec.js";

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

function emptyRecord(...viewIds) {
  return Object.fromEntries(
    viewIds.map((viewId) => [
      viewId,
      { choice: null, confidence: null, revealed: false },
    ]),
  );
}

const module19Empty = emptyRecord(
  "history",
  "linearization",
  "coordination",
  "progress",
  "models",
  "evidence",
);
const module19Progress = {
  ...module19Empty,
  history: { choice: "lost", confidence: 4, revealed: true },
};
const module23Empty = emptyRecord(
  "boundary",
  "grammar",
  "environment",
  "semantics",
  "contract",
  "bridge",
);
const module23Progress = {
  ...module23Empty,
  boundary: { choice: "syntax", confidence: 4, revealed: true },
};
const module24Empty = emptyRecord(
  "contract",
  "graph",
  "cycle",
  "lens",
  "runtime",
  "decision",
);
const module24Progress = {
  ...module24Empty,
  contract: { choice: "semantic", confidence: 4, revealed: true },
};
const module26Empty = emptyRecord(
  "brief",
  "threads",
  "failure",
  "patch",
  "ledger",
  "board",
);
const module26Progress = {
  ...module26Empty,
  brief: { choice: "bounded", confidence: 4, revealed: true },
};

test("M19 persistence removes stale generations when the only prediction evidence is cleared", () => {
  const storage = createMemoryStorage({
    [MODULE19_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify({ broad: true }),
  });

  assert.equal(persistModule19Progress(storage, module19Progress), true);
  assert.deepEqual(
    module19ProgressCodec.parse(storage.read(MODULE19_PROGRESS_STORAGE_KEY)),
    module19Progress,
  );
  assert.equal(storage.read(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);

  assert.equal(persistModule19Progress(storage, module19Empty), false);
  assert.equal(storage.read(MODULE19_PROGRESS_STORAGE_KEY), null);
  assert.equal(storage.read(MODULE19_LEGACY_PROGRESS_STORAGE_KEY), null);
});

test("M23 restores current evidence first, migrates legacy only when current is absent, and keeps blanks absent", () => {
  const currentFirstStorage = createMemoryStorage({
    [MODULE23_PROGRESS_STORAGE_KEY]: module23ProgressCodec.serialize(module23Progress),
    [MODULE23_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(module23Empty),
  });
  assert.deepEqual(restoreModule23Progress(currentFirstStorage), module23Progress);
  assert.deepEqual(currentFirstStorage.operations, [
    ["get", MODULE23_PROGRESS_STORAGE_KEY],
  ]);

  const malformedCurrentStorage = createMemoryStorage({
    [MODULE23_PROGRESS_STORAGE_KEY]: JSON.stringify(module23Progress),
    [MODULE23_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(module23Progress),
  });
  assert.equal(restoreModule23Progress(malformedCurrentStorage), null);
  assert.equal(malformedCurrentStorage.read(MODULE23_PROGRESS_STORAGE_KEY), null);
  assert.equal(malformedCurrentStorage.read(MODULE23_LEGACY_PROGRESS_STORAGE_KEY), null);

  const migrationStorage = createMemoryStorage({
    [MODULE23_LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(module23Progress),
  });
  assert.deepEqual(restoreModule23Progress(migrationStorage), module23Progress);
  assert.deepEqual(
    migrationStorage.operations.map(([operation, key]) => [operation, key]),
    [
      ["get", MODULE23_PROGRESS_STORAGE_KEY],
      ["get", MODULE23_LEGACY_PROGRESS_STORAGE_KEY],
      ["set", MODULE23_PROGRESS_STORAGE_KEY],
      ["remove", MODULE23_LEGACY_PROGRESS_STORAGE_KEY],
    ],
  );

  const blockedMigrationStorage = {
    getItem(key) {
      if (key === MODULE23_PROGRESS_STORAGE_KEY) return null;
      if (key === MODULE23_LEGACY_PROGRESS_STORAGE_KEY) {
        return JSON.stringify(module23Progress);
      }
      return null;
    },
    setItem() {
      throw new Error("local progress is unavailable");
    },
    removeItem() {
      throw new Error("local progress is unavailable");
    },
  };
  assert.deepEqual(
    restoreModule23Progress(blockedMigrationStorage),
    module23Progress,
  );

  assert.equal(persistModule23Progress(migrationStorage, module23Empty), false);
  assert.equal(migrationStorage.read(MODULE23_PROGRESS_STORAGE_KEY), null);
  assert.equal(migrationStorage.read(MODULE23_LEGACY_PROGRESS_STORAGE_KEY), null);
});

for (const {
  label,
  currentKey,
  legacyKey,
  codec,
  empty,
  progress,
  persist,
  restore,
} of [
  {
    label: "M24",
    currentKey: MODULE24_PROGRESS_STORAGE_KEY,
    legacyKey: MODULE24_LEGACY_PROGRESS_STORAGE_KEY,
    codec: module24ProgressCodec,
    empty: module24Empty,
    progress: module24Progress,
    persist: persistModule24Progress,
    restore: restoreModule24Progress,
  },
  {
    label: "M26",
    currentKey: MODULE26_PROGRESS_STORAGE_KEY,
    legacyKey: MODULE26_LEGACY_PROGRESS_STORAGE_KEY,
    codec: module26ProgressCodec,
    empty: module26Empty,
    progress: module26Progress,
    persist: persistModule26Progress,
    restore: restoreModule26Progress,
  },
]) {
  test(`${label} removes malformed or blank current state without reviving legacy progress`, () => {
    for (const current of [
      JSON.stringify(progress),
      codec.serialize(empty),
    ]) {
      const storage = createMemoryStorage({
        [currentKey]: current,
        [legacyKey]: JSON.stringify(progress),
      });

      assert.equal(restore(storage), null);
      assert.equal(storage.read(currentKey), null);
      assert.equal(storage.read(legacyKey), null);
    }
  });

  test(`${label} removes stale saved state instead of writing a blank default`, () => {
    const storage = createMemoryStorage({
      [currentKey]: codec.serialize(progress),
      [legacyKey]: JSON.stringify(progress),
    });

    assert.equal(persist(storage, empty), false);
    assert.equal(storage.read(currentKey), null);
    assert.equal(storage.read(legacyKey), null);
  });
}
