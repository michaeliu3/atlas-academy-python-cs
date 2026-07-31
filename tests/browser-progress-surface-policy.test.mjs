import assert from "node:assert/strict";
import test from "node:test";

import {
  loadBrowserProgressSurfacePolicy,
  scanBrowserProgressImports,
  scanBrowserProgressSource,
  validateBrowserProgressSurfacePolicy,
} from "../scripts/browser-progress-surface-policy.mjs";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("the browser-progress policy declares the complete checked-in surface inventory", async () => {
  const policy = await loadBrowserProgressSurfacePolicy();
  const report = await validateBrowserProgressSurfacePolicy(policy);

  assert.equal(report.surfaces.length, 14);
  assert.equal(report.adapterPath, "lib/browser-progress-storage.js");
  assert.deepEqual(
    report.surfaces.map(({ id }) => id),
    [
      "intake",
      "m18-os-studio",
      "m19-concurrency-studio",
      "m20-protocol-studio",
      "m21-async-distributed-studio",
      "m22-security-trust-studio",
      "m23-language-lab",
      "m24-runtime-observatory",
      "m25-evidence-studio",
      "m26-capstone-defense",
      "m27-discrete-math-studio",
      "m28-linear-algebra-studio",
      "m29-calculus-studio",
      "m30-probability-studio",
    ],
  );
});

test("the browser-progress policy rejects duplicate keys, forbidden data, and incomplete reset declarations", async () => {
  const policy = await loadBrowserProgressSurfacePolicy();

  const duplicateKey = clone(policy);
  duplicateKey.surfaces[1].current.key = duplicateKey.surfaces[0].current.key;
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(duplicateKey),
    /duplicates another declared key/u,
  );

  const forbiddenData = clone(policy);
  forbiddenData.surfaces[2].current.allowedDataClasses.push("timestamps");
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(forbiddenData),
    /forbidden browser-progress data class/u,
  );

  const incompleteReset = clone(policy);
  incompleteReset.surfaces[0].reset.removeKeys.pop();
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(incompleteReset),
    /reset must remove exactly/u,
  );
});

test("the storage scanner catches direct, computed, and forbidden browser-storage references", () => {
  const direct = scanBrowserProgressSource(
    "app/example.tsx",
    'window.localStorage.setItem("atlas.example.v1", "record");',
  );
  assert.deepEqual(direct.storageReferences.map(({ storageName }) => storageName), [
    "localStorage",
  ]);
  assert.deepEqual(direct.storageMethodCalls.map(({ method }) => method), ["setItem"]);

  const computed = scanBrowserProgressSource(
    "app/example.tsx",
    'globalThis["sessionStorage"].getItem("atlas.example.v1");',
  );
  assert.deepEqual(computed.storageReferences.map(({ storageName }) => storageName), [
    "sessionStorage",
  ]);
  assert.deepEqual(computed.storageMethodCalls.map(({ method }) => method), ["getItem"]);

  const staticComputed = scanBrowserProgressSource(
    "app/example.tsx",
    'const store = window["local" + "Storage"]; store["set" + "Item"]("atlas.example.v1", "record");',
  );
  assert.deepEqual(staticComputed.storageReferences.map(({ storageName }) => storageName), [
    "localStorage",
  ]);
  assert.deepEqual(staticComputed.storageMethodCalls.map(({ method }) => method), ["setItem"]);

  const dynamicGlobal = scanBrowserProgressSource(
    "app/example.tsx",
    'const property = "localStorage"; window[property].getItem("atlas.example.v1");',
  );
  assert.equal(dynamicGlobal.dynamicGlobalStorageProperties.length, 1);

  const reflected = scanBrowserProgressSource(
    "lib/example.js",
    'Reflect.get(window, "local" + "Storage").getItem("atlas.example.v1");',
  );
  assert.deepEqual(reflected.storageReferences.map(({ storageName }) => storageName), [
    "localStorage",
  ]);

  const inertText = scanBrowserProgressSource(
    "app/example.tsx",
    '// localStorage is teaching prose\nconst label = "sessionStorage";',
  );
  assert.deepEqual(inertText.storageReferences, []);
});

test("the policy import scanner sees real named lifecycle calls instead of comments or text", () => {
  const real = scanBrowserProgressImports(
    "app/example.tsx",
    [
      '"use client";',
      'import { getBrowserProgressStorage as storage } from "@/lib/browser-progress-storage";',
      'import { restoreModule27Progress as restore } from "@/lib/module27-progress-codec";',
      "const current = storage();",
      "restore(current);",
    ].join("\n"),
  );
  assert.equal(real.seamImportFound, true);
  assert.deepEqual([...real.seamBindings], ["storage"]);
  assert.deepEqual(real.lifecycleBindings, [
    {
      specifier: "@/lib/module27-progress-codec",
      importedName: "restoreModule27Progress",
      localName: "restore",
    },
  ]);
  assert.deepEqual([...real.calledLocalNames].sort(), ["restore", "storage"]);

  const inert = scanBrowserProgressImports(
    "app/example.tsx",
    '// import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";\nconst label = "restoreModule27Progress";',
  );
  assert.equal(inert.seamImportFound, false);
  assert.deepEqual(inert.lifecycleBindings, []);
  assert.deepEqual([...inert.calledLocalNames], []);
});
