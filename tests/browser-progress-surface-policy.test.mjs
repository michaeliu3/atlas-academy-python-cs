import assert from "node:assert/strict";
import test from "node:test";

import {
  browserProgressOwnerBindingPolicyRelativePath,
  browserProgressSurfacePolicyRelativePath,
  loadBrowserProgressOwnerBindingPolicy,
  loadBrowserProgressSurfacePolicy,
  scanBrowserProgressImports,
  scanBrowserProgressSource,
  validateBrowserProgressSurfacePolicy,
} from "../scripts/browser-progress-surface-policy.mjs";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("the v1 surface policy and v2 owner binding preserve the complete checked-in inventory", async () => {
  const [policy, ownerBindingPolicy] = await Promise.all([
    loadBrowserProgressSurfacePolicy(),
    loadBrowserProgressOwnerBindingPolicy(),
  ]);
  const report = await validateBrowserProgressSurfacePolicy(policy, { ownerBindingPolicy });

  assert.equal(policy.schemaVersion, 1);
  assert.equal(policy.policyVersion, "v1");
  assert.ok(
    policy.surfaces.every(
      ({ owner }) => Object.keys(owner).length === 2 && "moduleId" in owner && "lifecycle" in owner,
    ),
  );
  assert.equal(ownerBindingPolicy.schemaVersion, 2);
  assert.equal(ownerBindingPolicy.policyVersion, "v2");
  assert.ok(
    ownerBindingPolicy.bindings.every(
      ({ owner }) => Object.keys(owner).length === 2 && "moduleId" in owner && "availability" in owner,
    ),
  );
  assert.equal(report.policyPath, browserProgressSurfacePolicyRelativePath);
  assert.equal(report.ownerBindingPolicyPath, browserProgressOwnerBindingPolicyRelativePath);
  assert.equal(report.releaseInputPaths.length, 2);
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

test("the browser-progress policy rejects data violations and incompatible owner-schema migrations", async () => {
  const [policy, ownerBindingPolicy] = await Promise.all([
    loadBrowserProgressSurfacePolicy(),
    loadBrowserProgressOwnerBindingPolicy(),
  ]);

  const duplicateKey = clone(policy);
  duplicateKey.surfaces[1].current.key = duplicateKey.surfaces[0].current.key;
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(duplicateKey, { ownerBindingPolicy }),
    /duplicates another declared key/u,
  );

  const forbiddenData = clone(policy);
  forbiddenData.surfaces[2].current.allowedDataClasses.push("timestamps");
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(forbiddenData, { ownerBindingPolicy }),
    /forbidden browser-progress data class/u,
  );

  const incompleteReset = clone(policy);
  incompleteReset.surfaces[0].reset.removeKeys.pop();
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(incompleteReset, { ownerBindingPolicy }),
    /reset must remove exactly/u,
  );

  const forgedAvailability = clone(ownerBindingPolicy);
  forgedAvailability.bindings[1].owner.availability = "published";
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(policy, { ownerBindingPolicy: forgedAvailability }),
    /owner availability must match canonical Module 18 availability legacy-open/u,
  );

  const incompatibleV1Owner = clone(policy);
  incompatibleV1Owner.surfaces[1].owner = {
    moduleId: "m18",
    availability: "legacy-open",
  };
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(incompatibleV1Owner, { ownerBindingPolicy }),
    /must retain the v1 module-owner and historical lifecycle schema/u,
  );

  const detachedV2Binding = clone(ownerBindingPolicy);
  detachedV2Binding.surfacePolicy.policyVersion = "v2";
  await assert.rejects(
    validateBrowserProgressSurfacePolicy(policy, { ownerBindingPolicy: detachedV2Binding }),
    /must bind exactly browser-progress-surfaces\.v1\.json schemaVersion 1 policyVersion v1/u,
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
