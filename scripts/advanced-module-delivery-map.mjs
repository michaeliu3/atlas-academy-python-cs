function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function sameOrderedValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function sameMembers(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    new Set(actual).size === actual.length &&
    actual.every((value) => expected.includes(value))
  );
}

function requireExactKeys(record, keys, label, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const allowed = new Set(keys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      errors.push(`${label} has an unsupported field ${key}.`);
    }
  }
  for (const key of keys) {
    if (!(key in record)) {
      errors.push(`${label} is missing ${key}.`);
    }
  }
  return true;
}

function deliveryMapFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Advanced module delivery-map validation failed:\n- ${errors.join("\n- ")}`);
  }
}

/**
 * Validate a candidate-hashed delivery declaration against the canonical
 * advanced-module bridge. The declaration binds the real workbook and source
 * map to the promised session sequence and prerequisite/forward topology; it
 * intentionally does not infer the quality of the surrounding prose.
 */
export function validateAdvancedModuleDeliveryMap(
  deliveryMap,
  {
    courseModule,
    bridgeEntry,
    workbookPath,
    sourceMapPath,
  },
) {
  const errors = [];
  const moduleNumber = courseModule?.number ?? "(unknown)";
  const label = `Module ${moduleNumber} delivery map`;
  requireExactKeys(
    deliveryMap,
    [
      "schemaVersion",
      "deliveryMapVersion",
      "kind",
      "moduleId",
      "workbookPath",
      "sourceMapPath",
      "sessions",
      "forwardHandoff",
      "truthBoundary",
    ],
    label,
    errors,
  );
  if (deliveryMap?.schemaVersion !== 1 || deliveryMap?.deliveryMapVersion !== "v1") {
    errors.push(`${label} must use schemaVersion 1 and deliveryMapVersion v1.`);
  }
  if (deliveryMap?.kind !== "atlas-advanced-module-delivery-map") {
    errors.push(`${label} has an invalid kind.`);
  }
  if (deliveryMap?.moduleId !== courseModule?.id) {
    errors.push(`${label}.moduleId must match the canonical graph module.`);
  }
  if (deliveryMap?.workbookPath !== workbookPath) {
    errors.push(`${label}.workbookPath must bind the module's checked-in workbook.`);
  }
  if (deliveryMap?.sourceMapPath !== sourceMapPath) {
    errors.push(`${label}.sourceMapPath must bind the module's checked-in source map.`);
  }
  if (!hasText(deliveryMap?.truthBoundary)) {
    errors.push(`${label}.truthBoundary must state the declaration's limited structural claim.`);
  }
  if (!bridgeEntry || bridgeEntry.moduleId !== courseModule?.id) {
    errors.push(`${label} requires the matching canonical prerequisite-session bridge entry.`);
    deliveryMapFailure(errors);
  }

  const expectedSessions = bridgeEntry.sessionSpine;
  if (!Array.isArray(expectedSessions) || expectedSessions.length !== 6) {
    errors.push(`${label} canonical bridge must define exactly six sessions.`);
  }
  if (!Array.isArray(deliveryMap?.sessions) || deliveryMap.sessions.length !== 6) {
    errors.push(`${label} must declare exactly six delivered sessions.`);
  } else if (Array.isArray(expectedSessions) && expectedSessions.length === 6) {
    const deliverySessionById = new Map();
    const deliveredArtifactIds = [];
    for (const [index, deliveredSession] of deliveryMap.sessions.entries()) {
      const expectedSession = expectedSessions[index];
      const sessionLabel = `${label} session ${index + 1}`;
      requireExactKeys(
        deliveredSession,
        ["id", "title", "usesPrerequisiteModuleIds", "producesForwardArtifactIds"],
        sessionLabel,
        errors,
      );
      if (deliveredSession?.id !== expectedSession?.id || deliverySessionById.has(deliveredSession?.id)) {
        errors.push(`${sessionLabel} ID must match the ordered canonical bridge exactly.`);
      }
      if (hasText(deliveredSession?.id)) {
        deliverySessionById.set(deliveredSession.id, deliveredSession);
      }
      if (deliveredSession?.title !== expectedSession?.title) {
        errors.push(`${sessionLabel} title must match the canonical bridge exactly.`);
      }
      if (!sameOrderedValues(deliveredSession?.usesPrerequisiteModuleIds, expectedSession?.usesPrerequisiteModuleIds)) {
        errors.push(`${sessionLabel} prerequisite use must match the canonical bridge exactly.`);
      }
      if (
        !Array.isArray(deliveredSession?.producesForwardArtifactIds) ||
        new Set(deliveredSession.producesForwardArtifactIds).size !== deliveredSession.producesForwardArtifactIds.length ||
        deliveredSession.producesForwardArtifactIds.some((artifactId) => !hasText(artifactId))
      ) {
        errors.push(`${sessionLabel} producesForwardArtifactIds must be a unique array of non-empty IDs.`);
      } else {
        deliveredArtifactIds.push(...deliveredSession.producesForwardArtifactIds);
      }
    }

    const expectedArtifactIds = bridgeEntry.prerequisiteBridges?.map(
      ({ forwardArtifact }) => forwardArtifact?.id,
    );
    if (!sameMembers(deliveredArtifactIds, expectedArtifactIds ?? [])) {
      errors.push(`${label} must produce every canonical prerequisite bridge artifact exactly once.`);
    }
    for (const bridge of bridgeEntry.prerequisiteBridges ?? []) {
      const firstDelivery = deliverySessionById.get(bridge?.firstConsumingSessionId);
      if (!firstDelivery?.producesForwardArtifactIds?.includes(bridge?.forwardArtifact?.id)) {
        errors.push(
          `${label} must produce ${bridge?.forwardArtifact?.id ?? "the bridge artifact"} in its canonical first-consuming session.`,
        );
      }
    }
  }

  requireExactKeys(
    deliveryMap?.forwardHandoff,
    ["declaredForwardModuleId", "directAcademicConsumerModuleIds", "handoffArtifact", "note"],
    `${label} forward handoff`,
    errors,
  );
  if (deliveryMap?.forwardHandoff?.declaredForwardModuleId !== bridgeEntry.forwardHandoff?.declaredForwardModuleId) {
    errors.push(`${label} forward handoff module must match the canonical bridge.`);
  }
  if (
    !sameOrderedValues(
      deliveryMap?.forwardHandoff?.directAcademicConsumerModuleIds,
      bridgeEntry.forwardHandoff?.directAcademicConsumerModuleIds,
    )
  ) {
    errors.push(`${label} direct academic consumers must match the canonical bridge.`);
  }
  if (deliveryMap?.forwardHandoff?.handoffArtifact !== bridgeEntry.forwardHandoff?.handoffArtifact) {
    errors.push(`${label} handoff artifact must match the canonical bridge.`);
  }
  if (deliveryMap?.forwardHandoff?.note !== bridgeEntry.forwardHandoff?.note) {
    errors.push(`${label} handoff note must match the canonical bridge.`);
  }

  deliveryMapFailure(errors);
  return deliveryMap;
}
