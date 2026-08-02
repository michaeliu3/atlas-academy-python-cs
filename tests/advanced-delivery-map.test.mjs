import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  validateAdvancedAuthoringDeliveryMap,
  validateAdvancedModuleDeliveryMap,
} from "../scripts/advanced-module-delivery-map.mjs";
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

async function authoringDeliveryFixture(moduleId) {
  const advancedRegistryPath = resolve(
    siteRoot,
    "content/course/contracts/advanced-module-contracts.v1.json",
  );
  const [graph, bridgeLedger, registryText] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleBridgeLedger(siteRoot),
    readFile(advancedRegistryPath, "utf8"),
  ]);
  const adapter = JSON.parse(registryText).modules.find((entry) => entry.moduleId === moduleId);
  const inputById = new Map(adapter.contractInputs.map((input) => [input.id, input]));
  const authoringWorkbookPath = inputById.get(`${moduleId}-authoring-workbook-draft`).path;
  const authoringDeliveryMapPath = inputById.get(adapter.authoringDeliveryMapInputId).path;
  const authoringSourcePlanInput =
    inputById.get(`${moduleId}-source-research-sessions`) ??
    inputById.get(`${moduleId}-source-map-sessions`);
  assert.ok(authoringSourcePlanInput, `${moduleId} must declare a session-level source-plan input`);
  const authoringSourcePlanPath = authoringSourcePlanInput.path;
  const [workbookMarkdown, deliveryMapText] = await Promise.all([
    readFile(resolve(siteRoot, authoringWorkbookPath), "utf8"),
    readFile(resolve(siteRoot, authoringDeliveryMapPath), "utf8"),
  ]);
  const courseModule = graph.modules.find(({ id }) => id === moduleId);
  const bridgeEntry = bridgeLedger.modules.find((entry) => entry.moduleId === moduleId);
  return {
    deliveryMap: JSON.parse(deliveryMapText),
    options: {
      courseModule,
      bridgeEntry,
      bridgePath: "content/course/m31-m36-prerequisite-session-bridge.v1.json",
      workbookPath: authoringWorkbookPath,
      authoringSourcePlanPath,
      workbookMarkdown,
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

test("the hidden M31-M36 authoring delivery maps bind each visible session output", async () => {
  for (const moduleId of ["m31", "m32", "m33", "m34", "m35", "m36"]) {
    const { deliveryMap, options } = await authoringDeliveryFixture(moduleId);
    assert.equal(validateAdvancedAuthoringDeliveryMap(deliveryMap, options), deliveryMap);
  }
});

test("the hidden M31 authoring delivery map rejects missing, duplicate, misplaced, and orphan outputs", async () => {
  const { deliveryMap, options } = await authoringDeliveryFixture("m31");

  const missingForwardArtifact = structuredClone(deliveryMap);
  missingForwardArtifact.sessions[0].outputs[0].forwardArtifactId = null;
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(missingForwardArtifact, options),
    /must bind every canonical prerequisite bridge artifact exactly once/u,
  );

  const duplicateOutput = structuredClone(deliveryMap);
  duplicateOutput.sessions[1].outputs.push(structuredClone(duplicateOutput.sessions[0].outputs[0]));
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(duplicateOutput, options),
    /must be a unique module-scoped artifact identifier/u,
  );

  const crossModuleOutput = structuredClone(deliveryMap);
  crossModuleOutput.sessions[2].outputs[0].id = "m32-constraint-claim-table";
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(crossModuleOutput, options),
    /must be a unique module-scoped artifact identifier/u,
  );

  const misplacedOutput = structuredClone(deliveryMap);
  const [sessionOneOutput] = misplacedOutput.sessions[0].outputs;
  misplacedOutput.sessions[0].outputs = [];
  misplacedOutput.sessions[1].outputs.push(sessionOneOutput);
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(misplacedOutput, options),
    /must appear inside its declared session rather than another session/u,
  );

  const orphanOutputOptions = {
    ...options,
    workbookMarkdown: options.workbookMarkdown.replace(
      "### Output: Constraint Claim Table",
      "### Output: Unbound experiment note",
    ),
  };
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(deliveryMap, orphanOutputOptions),
    /has an orphan visible output heading/u,
  );

  const undeclaredSessionOptions = {
    ...options,
    workbookMarkdown: options.workbookMarkdown.replace(
      "### Output: Optimization and Information Evidence Dossier",
      "## Session 7 — Undeclared continuation\n\n### Output: Optimization and Information Evidence Dossier",
    ),
  };
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(deliveryMap, undeclaredSessionOptions),
    /must expose exactly six Session 1 through Session 6 headings/u,
  );

  const outputOutsideSessionOptions = {
    ...options,
    workbookMarkdown: options.workbookMarkdown.replace(
      "### Output: Optimization and Information Evidence Dossier",
      "## Appendix — Outside Session 6\n\n### Output: Optimization and Information Evidence Dossier",
    ),
  };
  assert.throws(
    () => validateAdvancedAuthoringDeliveryMap(deliveryMap, outputOutsideSessionOptions),
    /must appear inside its declared session rather than another session/u,
  );
});

test("the M31-M36 authoring contracts keep learner delivery null and bind hidden output topology separately", async () => {
  const registryPath = resolve(
    siteRoot,
    "content/course/contracts/advanced-module-contracts.v1.json",
  );
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  for (const moduleId of ["m31", "m32", "m33", "m34", "m35", "m36"]) {
    const courseModule = registry.modules.find((entry) => entry.moduleId === moduleId);
    assert.equal(courseModule.deliveryMapInputId, null);
    assert.equal(courseModule.authoringDeliveryMapInputId, `${moduleId}-authoring-delivery-map`);
  }
});

test("the advanced bridge's blocker wording matches the current authoring-only registry state", async () => {
  const [bridgeLedger, registryText] = await Promise.all([
    loadAdvancedModuleBridgeLedger(siteRoot),
    readFile(resolve(siteRoot, "content/course/contracts/module-contract-registry.v3.json"), "utf8"),
  ]);
  const registry = JSON.parse(registryText);

  for (const moduleId of ["m32", "m33", "m34", "m35", "m36"]) {
    const bridgeEntry = bridgeLedger.modules.find((entry) => entry.moduleId === moduleId);
    const contract = registry.modules.find((entry) => entry.moduleId === moduleId);
    const blocker = bridgeEntry.releaseBlockers.find(
      ({ id }) => id === `${moduleId}-contract-and-provenance-unmet`,
    );

    assert.equal(contract?.contractState, "authoring-only");
    assert.match(blocker?.blockingReason ?? "", /authoring-only v3 registry record/u);
    assert.doesNotMatch(blocker?.blockingReason ?? "", /not-started v3 registry plan/u);
  }
});
