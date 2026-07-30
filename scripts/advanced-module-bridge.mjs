import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const advancedModuleBridgeRelativePath =
  "content/course/m31-m36-prerequisite-session-bridge.v1.json";

export function advancedModuleBridgePath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, advancedModuleBridgeRelativePath);
}

export async function loadAdvancedModuleBridgeLedger(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(advancedModuleBridgePath(siteRoot), "utf8"));
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function sameMembers(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    new Set(actual).size === actual.length &&
    actual.every((value) => expected.includes(value))
  );
}

function bridgeFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Advanced module bridge validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function validateText(value, label, errors) {
  if (!hasText(value)) {
    errors.push(`${label} must be a non-empty string.`);
  }
}

function validateAdvancedModuleBridge(graph, ledger, { requireAuthoringOnlyGraphState }) {
  const errors = [];
  const graphModules = graph?.modules;
  if (!Array.isArray(graphModules)) {
    bridgeFailure(["canonical graph must define modules before the bridge can be checked."]);
  }
  const moduleByNumber = new Map(graphModules.map((courseModule) => [courseModule.number, courseModule]));
  const advancedModules = graphModules
    .filter(({ number }) => Number.isInteger(number) && number >= 31 && number <= 36)
    .sort((left, right) => left.number - right.number);
  const expectedModuleIds = advancedModules.map(({ id }) => id);

  if (advancedModules.length !== 6) {
    errors.push("canonical graph must define exactly Modules 31–36 for the advanced bridge.");
  }
  if (ledger?.schemaVersion !== 1 || ledger?.ledgerVersion !== "v1") {
    errors.push("advanced module bridge must use schemaVersion 1 and ledgerVersion v1.");
  }
  if (ledger?.kind !== "atlas-prerequisite-session-bridge") {
    errors.push("advanced module bridge has an invalid kind.");
  }
  if (ledger?.canonicalCourseGraph !== "content/course/course-graph.v1.json") {
    errors.push("advanced module bridge must name the canonical course graph.");
  }
  if (!hasText(ledger?.purpose)) {
    errors.push("advanced module bridge must describe its limited authoring purpose.");
  }
  if (!hasText(ledger?.truthBoundary?.moduleState)) {
    errors.push("advanced module bridge must state its authoring-only truth boundary.");
  }
  if (!sameMembers(ledger?.validationRules?.requiredModuleIds, expectedModuleIds)) {
    errors.push("advanced module bridge requiredModuleIds must match Modules 31–36 exactly.");
  }
  for (const rule of [
    "requireExactlySixSessionSpineEntries",
    "requireOneBridgeForEveryGraphAcademicPrerequisite",
    "requireFirstConsumingSessionInSameModuleSpine",
    "requireAuthoringOnlyGraphState",
    "forbidPublicationOrReleaseClaims",
  ]) {
    if (ledger?.validationRules?.[rule] !== true) {
      errors.push(`advanced module bridge validationRules.${rule} must be true.`);
    }
  }
  if (!Array.isArray(ledger?.modules)) {
    errors.push("advanced module bridge must define modules.");
    bridgeFailure(errors);
  }

  const entryByModuleId = new Map();
  for (const entry of ledger.modules) {
    if (!hasText(entry?.moduleId) || entryByModuleId.has(entry.moduleId)) {
      errors.push("advanced module bridge module IDs must be present and unique.");
      continue;
    }
    entryByModuleId.set(entry.moduleId, entry);
  }
  if (!sameMembers([...entryByModuleId.keys()], expectedModuleIds)) {
    errors.push("advanced module bridge entries must match Modules 31–36 exactly.");
  }

  for (const courseModule of advancedModules) {
    const entry = entryByModuleId.get(courseModule.id);
    if (!entry) {
      continue;
    }
    if (
      requireAuthoringOnlyGraphState &&
      (courseModule.lifecycle !== "authoring-only" || courseModule.availability !== "authoring-only")
    ) {
      errors.push(
        `Module ${courseModule.number} bridge is an authoring-only plan but the graph no longer has an authoring-only state.`,
      );
    }
    if (entry.planningState !== "authoring-only-plan") {
      errors.push(`Module ${courseModule.number} bridge must remain an authoring-only plan.`);
    }

    const expectedPrerequisiteIds = courseModule.academicPrerequisiteNumbers.map((number) => {
      const prerequisite = moduleByNumber.get(number);
      if (!prerequisite) {
        errors.push(`Module ${courseModule.number} bridge has a missing graph prerequisite ${number}.`);
        return `missing-${number}`;
      }
      return prerequisite.id;
    });
    const expectedForwardModuleId =
      courseModule.forwardModuleNumber === null
        ? null
        : moduleByNumber.get(courseModule.forwardModuleNumber)?.id ?? null;

    if (entry?.graph?.number !== courseModule.number) {
      errors.push(`Module ${courseModule.number} bridge number does not match the graph.`);
    }
    if (entry?.graph?.slug !== courseModule.slug || entry?.graph?.title !== courseModule.title) {
      errors.push(`Module ${courseModule.number} bridge identity does not match the graph.`);
    }
    if (!sameMembers(entry?.graph?.academicPrerequisiteModuleIds, expectedPrerequisiteIds)) {
      errors.push(`Module ${courseModule.number} bridge prerequisites do not match the graph.`);
    }
    if (entry?.graph?.declaredForwardModuleId !== expectedForwardModuleId) {
      errors.push(`Module ${courseModule.number} bridge forward handoff does not match the graph.`);
    }

    const sessions = entry.sessionSpine;
    if (!Array.isArray(sessions) || sessions.length !== 6) {
      errors.push(`Module ${courseModule.number} bridge must define exactly six session-spine entries.`);
      continue;
    }
    const sessionById = new Map();
    for (const [index, session] of sessions.entries()) {
      const expectedSessionId = `${courseModule.id}-s${String(index + 1).padStart(2, "0")}`;
      if (session?.id !== expectedSessionId || sessionById.has(session.id)) {
        errors.push(`Module ${courseModule.number} bridge session IDs must be ordered and unique.`);
      }
      if (hasText(session?.id)) {
        sessionById.set(session.id, session);
      }
      validateText(session?.title, `Module ${courseModule.number} session ${index + 1} title`, errors);
      validateText(
        session?.progression,
        `Module ${courseModule.number} session ${index + 1} progression`,
        errors,
      );
      validateText(
        session?.plannedEvidence,
        `Module ${courseModule.number} session ${index + 1} planned evidence`,
        errors,
      );
      if (!Array.isArray(session?.usesPrerequisiteModuleIds)) {
        errors.push(`Module ${courseModule.number} session ${index + 1} must declare prerequisite use.`);
      } else if (
        session.usesPrerequisiteModuleIds.some(
          (moduleId) => !expectedPrerequisiteIds.includes(moduleId),
        )
      ) {
        errors.push(`Module ${courseModule.number} session ${index + 1} uses a non-prerequisite module.`);
      }
    }

    const bridges = entry.prerequisiteBridges;
    if (!Array.isArray(bridges)) {
      errors.push(`Module ${courseModule.number} bridge must define prerequisite bridges.`);
      continue;
    }
    const bridgeByPrerequisiteId = new Map();
    const artifactIds = new Set();
    for (const bridge of bridges) {
      if (!hasText(bridge?.prerequisiteModuleId) || bridgeByPrerequisiteId.has(bridge.prerequisiteModuleId)) {
        errors.push(`Module ${courseModule.number} bridge prerequisite IDs must be present and unique.`);
        continue;
      }
      bridgeByPrerequisiteId.set(bridge.prerequisiteModuleId, bridge);
      validateText(
        bridge.inheritedConcept,
        `Module ${courseModule.number} bridge inherited concept`,
        errors,
      );
      validateText(
        bridge.likelyMisconception,
        `Module ${courseModule.number} bridge likely misconception`,
        errors,
      );
      validateText(
        bridge?.retrievalCheck?.prompt,
        `Module ${courseModule.number} bridge retrieval prompt`,
        errors,
      );
      validateText(
        bridge?.retrievalCheck?.acceptableEvidence,
        `Module ${courseModule.number} bridge retrieval evidence`,
        errors,
      );
      validateText(
        bridge?.forwardArtifact?.id,
        `Module ${courseModule.number} bridge forward artifact ID`,
        errors,
      );
      validateText(
        bridge?.forwardArtifact?.description,
        `Module ${courseModule.number} bridge forward artifact description`,
        errors,
      );
      validateText(
        bridge?.forwardArtifact?.intendedUse,
        `Module ${courseModule.number} bridge forward artifact use`,
        errors,
      );
      if (hasText(bridge?.forwardArtifact?.id) && artifactIds.has(bridge.forwardArtifact.id)) {
        errors.push(`Module ${courseModule.number} bridge forward artifact IDs must be unique.`);
      }
      if (hasText(bridge?.forwardArtifact?.id)) {
        artifactIds.add(bridge.forwardArtifact.id);
      }

      const firstSession = sessionById.get(bridge.firstConsumingSessionId);
      if (!firstSession) {
        errors.push(`Module ${courseModule.number} bridge first consuming session is missing.`);
        continue;
      }
      const firstUse = sessions.find((session) =>
        session?.usesPrerequisiteModuleIds?.includes(bridge.prerequisiteModuleId),
      );
      if (!firstUse || firstUse.id !== bridge.firstConsumingSessionId) {
        errors.push(
          `Module ${courseModule.number} bridge first consuming session must be the first declared use of ${bridge.prerequisiteModuleId}.`,
        );
      }
    }
    if (!sameMembers([...bridgeByPrerequisiteId.keys()], expectedPrerequisiteIds)) {
      errors.push(`Module ${courseModule.number} bridge coverage does not match graph prerequisites.`);
    }
  }

  bridgeFailure(errors);
  return ledger;
}

/**
 * Validate the original authoring bridge while every advanced graph node is
 * still authoring-only. This is the historical planning gate used before any
 * advanced lifecycle transition.
 */
export function validateAdvancedModuleBridgeLedger(graph, ledger) {
  return validateAdvancedModuleBridge(graph, ledger, {
    requireAuthoringOnlyGraphState: true,
  });
}

/**
 * Validate bridge identity, prerequisite topology, first consumption, session
 * order, and forward handoffs after a lifecycle transition. It intentionally
 * does not require the current graph to remain authoring-only, because the
 * ledger preserves the original plan rather than overriding publication state.
 */
export function validateAdvancedModuleBridgeTopology(graph, ledger) {
  return validateAdvancedModuleBridge(graph, ledger, {
    requireAuthoringOnlyGraphState: false,
  });
}
