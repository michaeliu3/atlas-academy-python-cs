import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateAdvancedModuleDeliveryMap } from "../scripts/advanced-module-delivery-map.mjs";
import { loadAdvancedModuleBridgeLedger } from "../scripts/advanced-module-bridge.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

function deliveryMapFromBridge(bridgeEntry) {
  return {
    schemaVersion: 1,
    deliveryMapVersion: "v1",
    kind: "atlas-advanced-module-delivery-map",
    moduleId: bridgeEntry.moduleId,
    workbookPath: "content/modules/31_optimization_information.md",
    sourceMapPath: "content/source-maps/module31_optimization_information_source_map.md",
    sessions: bridgeEntry.sessionSpine.map((session) => ({
      id: session.id,
      title: session.title,
      usesPrerequisiteModuleIds: [...session.usesPrerequisiteModuleIds],
      producesForwardArtifactIds: bridgeEntry.prerequisiteBridges
        .filter(({ firstConsumingSessionId }) => firstConsumingSessionId === session.id)
        .map(({ forwardArtifact }) => forwardArtifact.id),
    })),
    forwardHandoff: structuredClone(bridgeEntry.forwardHandoff),
    truthBoundary:
      "This candidate-hashed declaration proves only the delivered structural topology, not prose quality, human approval, CI, deployment, or learner mastery.",
  };
}

async function m31DeliveryFixture() {
  const [graph, bridgeLedger] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleBridgeLedger(siteRoot),
  ]);
  const courseModule = graph.modules.find(({ id }) => id === "m31");
  const bridgeEntry = bridgeLedger.modules.find(({ moduleId }) => moduleId === "m31");
  return {
    courseModule,
    bridgeEntry,
    deliveryMap: deliveryMapFromBridge(bridgeEntry),
    options: {
      courseModule,
      bridgeEntry,
      workbookPath: "content/modules/31_optimization_information.md",
      sourceMapPath: "content/source-maps/module31_optimization_information_source_map.md",
    },
  };
}

test("a candidate delivery map preserves the M31 session and bridge topology", async () => {
  const { deliveryMap, options } = await m31DeliveryFixture();
  assert.equal(validateAdvancedModuleDeliveryMap(deliveryMap, options), deliveryMap);
});

test("a candidate delivery map rejects session, prerequisite, artifact, and handoff drift", async () => {
  const { deliveryMap, options } = await m31DeliveryFixture();

  const wrongTitle = structuredClone(deliveryMap);
  wrongTitle.sessions[1].title = "An attractive but wrong title";
  assert.throws(
    () => validateAdvancedModuleDeliveryMap(wrongTitle, options),
    /session 2 title must match the canonical bridge exactly/u,
  );

  const wrongFirstUse = structuredClone(deliveryMap);
  wrongFirstUse.sessions[0].usesPrerequisiteModuleIds = [];
  assert.throws(
    () => validateAdvancedModuleDeliveryMap(wrongFirstUse, options),
    /session 1 prerequisite use must match the canonical bridge exactly/u,
  );

  const misplacedArtifact = structuredClone(deliveryMap);
  const [artifactId] = misplacedArtifact.sessions[0].producesForwardArtifactIds;
  misplacedArtifact.sessions[0].producesForwardArtifactIds = [];
  misplacedArtifact.sessions[1].producesForwardArtifactIds.push(artifactId);
  assert.throws(
    () => validateAdvancedModuleDeliveryMap(misplacedArtifact, options),
    /must produce m31-objective-geometry-sheet in its canonical first-consuming session/u,
  );

  const wrongHandoff = structuredClone(deliveryMap);
  wrongHandoff.forwardHandoff.declaredForwardModuleId = "m26";
  assert.throws(
    () => validateAdvancedModuleDeliveryMap(wrongHandoff, options),
    /forward handoff module must match the canonical bridge/u,
  );
});

test("the M31 authoring contract deliberately has no delivered-map input yet", async () => {
  const registryPath = resolve(
    siteRoot,
    "content/course/contracts/advanced-module-contracts.v1.json",
  );
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  assert.equal(registry.modules[0].moduleId, "m31");
  assert.equal(registry.modules[0].deliveryMapInputId, null);
});
