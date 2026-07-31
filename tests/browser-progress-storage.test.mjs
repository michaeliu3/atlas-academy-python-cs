import assert from "node:assert/strict";
import test from "node:test";

import { getBrowserProgressStorage } from "../lib/browser-progress-storage.js";
import {
  DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY,
  DIAGNOSTIC_PROGRESS_STORAGE_KEY,
  restoreDiagnosticProgress,
} from "../lib/diagnostic-progress-codec.js";
import { createEmptyAttempt, diagnosticQuestions } from "../lib/diagnostic-model.js";
import {
  MODULE23_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE23_PROGRESS_STORAGE_KEY,
  restoreModule23Progress,
} from "../lib/module23-progress-codec.js";
import {
  MODULE24_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE24_PROGRESS_STORAGE_KEY,
  restoreModule24Progress,
} from "../lib/module24-progress-codec.js";
import {
  MODULE26_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE26_PROGRESS_STORAGE_KEY,
  restoreModule26Progress,
} from "../lib/module26-progress-codec.js";

function withBrowserWindow(localStorage, action) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage },
  });
  try {
    return action();
  } finally {
    if (descriptor) {
      Object.defineProperty(globalThis, "window", descriptor);
    } else {
      delete globalThis.window;
    }
  }
}

test("the browser-progress seam narrows storage and reports unavailable mutations", () => {
  const data = new Map();
  withBrowserWindow(
    {
      getItem(key) {
        return data.get(key) ?? null;
      },
      setItem(key, value) {
        data.set(key, value);
      },
      removeItem(key) {
        data.delete(key);
      },
    },
    () => {
      const storage = getBrowserProgressStorage();
      assert.ok(storage);
      assert.deepEqual(Object.keys(storage).sort(), ["getItem", "removeItem", "setItem"]);
      storage.setItem("atlas.example", "record");
      assert.equal(storage.getItem("atlas.example"), "record");
      storage.removeItem("atlas.example");
      assert.equal(storage.getItem("atlas.example"), null);
    },
  );

  withBrowserWindow(
    {
      getItem() {
        throw new Error("denied");
      },
      setItem() {
        throw new Error("denied");
      },
      removeItem() {
        throw new Error("denied");
      },
    },
    () => {
      assert.equal(getBrowserProgressStorage(), null);
    },
  );

  withBrowserWindow(
    {
      getItem() {
        return null;
      },
      setItem() {
        throw new Error("denied");
      },
      removeItem() {
        throw new Error("denied");
      },
    },
    () => {
      const storage = getBrowserProgressStorage();
      assert.ok(storage);
      assert.equal(storage.setItem("atlas.example", "record"), false);
      assert.equal(storage.removeItem("atlas.example"), false);
    },
  );
});

test("the browser-progress seam is absent during server rendering", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  delete globalThis.window;
  try {
    assert.equal(getBrowserProgressStorage(), null);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
  }
});

function predictionRecord(viewIds, selectedView, choice) {
  return Object.fromEntries(
    viewIds.map((viewId) => [
      viewId,
      viewId === selectedView
        ? { choice, confidence: 4, revealed: true }
        : { choice: null, confidence: null, revealed: false },
    ]),
  );
}

test("a denied browser write preserves meaningful legacy progress during every current-first migration", () => {
  const [firstQuestion] = diagnosticQuestions;
  const diagnosticLegacyAttempt = {
    ...createEmptyAttempt("2026-07-31T00:00:00.000Z"),
    responsesByQuestionId: {
      [firstQuestion.id]: {
        optionId: firstQuestion.correctOptionId,
        confidence: "high",
        revealed: true,
      },
    },
  };
  const fixtures = [
    {
      label: "intake",
      currentKey: DIAGNOSTIC_PROGRESS_STORAGE_KEY,
      legacyKey: DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY,
      legacyValue: JSON.stringify(diagnosticLegacyAttempt),
      restore: (storage) => restoreDiagnosticProgress(storage, "2026-07-31T01:00:00.000Z"),
    },
    {
      label: "M23",
      currentKey: MODULE23_PROGRESS_STORAGE_KEY,
      legacyKey: MODULE23_LEGACY_PROGRESS_STORAGE_KEY,
      legacyValue: JSON.stringify(
        predictionRecord(
          ["boundary", "grammar", "environment", "semantics", "contract", "bridge"],
          "boundary",
          "syntax",
        ),
      ),
      restore: restoreModule23Progress,
    },
    {
      label: "M24",
      currentKey: MODULE24_PROGRESS_STORAGE_KEY,
      legacyKey: MODULE24_LEGACY_PROGRESS_STORAGE_KEY,
      legacyValue: JSON.stringify(
        predictionRecord(
          ["contract", "graph", "cycle", "lens", "runtime", "decision"],
          "contract",
          "semantic",
        ),
      ),
      restore: restoreModule24Progress,
    },
    {
      label: "M26",
      currentKey: MODULE26_PROGRESS_STORAGE_KEY,
      legacyKey: MODULE26_LEGACY_PROGRESS_STORAGE_KEY,
      legacyValue: JSON.stringify(
        predictionRecord(
          ["brief", "threads", "failure", "patch", "ledger", "board"],
          "brief",
          "bounded",
        ),
      ),
      restore: restoreModule26Progress,
    },
  ];

  for (const fixture of fixtures) {
    const values = new Map([[fixture.legacyKey, fixture.legacyValue]]);
    withBrowserWindow(
      {
        getItem(key) {
          return values.get(key) ?? null;
        },
        setItem() {
          throw new Error("denied");
        },
        removeItem(key) {
          values.delete(key);
        },
      },
      () => {
        const storage = getBrowserProgressStorage();
        assert.ok(storage, `${fixture.label} needs the safe browser adapter`);
        assert.ok(fixture.restore(storage), `${fixture.label} keeps the current visit usable`);
        assert.equal(values.get(fixture.currentKey), undefined);
        assert.equal(
          values.get(fixture.legacyKey),
          fixture.legacyValue,
          `${fixture.label} must not delete legacy evidence after a denied replacement write`,
        );
      },
    );
  }
});
