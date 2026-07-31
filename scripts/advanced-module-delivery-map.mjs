import { extractTableOfContents } from "../lib/heading-ids.js";

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

const authoringOutputKinds = new Set([
  "claim-table",
  "dossier",
  "experiment-card",
  "ledger",
  "rationale",
  "worksheet",
]);

function moduleArtifactIdentifier(value, moduleId) {
  return (
    typeof moduleId === "string" &&
    typeof value === "string" &&
    value.startsWith(`${moduleId}-`) &&
    /^m(?:0[1-9]|[1-9]\d)-[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)
  );
}

function isVisibleOutputHeading(heading) {
  return heading?.depth === 3 && /^Output:\s+\S/u.test(heading.title ?? "");
}

function nearestPrecedingH2Heading(headings, headingIndex) {
  return headings
    .filter(({ depth, index }) => depth === 2 && index < headingIndex)
    .at(-1) ?? null;
}

/**
 * Validate a hidden authoring candidate without selecting learner-facing
 * delivery. Unlike a later delivery map, this map binds a reviewed draft's
 * real session headings and locally visible outputs while the graph stays
 * authoring-only, hidden, and absent from the learner manifest.
 */
export function validateAdvancedAuthoringDeliveryMap(
  deliveryMap,
  {
    courseModule,
    bridgeEntry,
    bridgePath,
    workbookPath,
    authoringSourcePlanPath,
    workbookMarkdown,
  },
) {
  const errors = [];
  const moduleNumber = courseModule?.number ?? "(unknown)";
  const label = `Module ${moduleNumber} authoring delivery map`;
  requireExactKeys(
    deliveryMap,
    [
      "schemaVersion",
      "deliveryMapVersion",
      "kind",
      "moduleId",
      "workbookPath",
      "authoringSourcePlanPath",
      "bridgePath",
      "sessions",
      "forwardHandoff",
      "localForwardHandoffOutputId",
      "truthBoundary",
    ],
    label,
    errors,
  );
  if (deliveryMap?.schemaVersion !== 1 || deliveryMap?.deliveryMapVersion !== "v1") {
    errors.push(`${label} must use schemaVersion 1 and deliveryMapVersion v1.`);
  }
  if (deliveryMap?.kind !== "atlas-advanced-authoring-delivery-map") {
    errors.push(`${label} has an invalid kind.`);
  }
  if (deliveryMap?.moduleId !== courseModule?.id) {
    errors.push(`${label}.moduleId must match the canonical graph module.`);
  }
  if (deliveryMap?.workbookPath !== workbookPath) {
    errors.push(`${label}.workbookPath must bind the hidden authoring workbook.`);
  }
  if (deliveryMap?.authoringSourcePlanPath !== authoringSourcePlanPath) {
    errors.push(`${label}.authoringSourcePlanPath must bind the declared instructor-facing source plan.`);
  }
  if (deliveryMap?.bridgePath !== bridgePath) {
    errors.push(`${label}.bridgePath must bind the canonical prerequisite-session bridge.`);
  }
  if (!hasText(deliveryMap?.truthBoundary)) {
    errors.push(`${label}.truthBoundary must state the declaration's limited structural claim.`);
  }
  if (!bridgeEntry || bridgeEntry.moduleId !== courseModule?.id) {
    errors.push(`${label} requires the matching canonical prerequisite-session bridge entry.`);
    deliveryMapFailure(errors);
  }
  if (typeof workbookMarkdown !== "string") {
    errors.push(`${label} requires the hidden authoring workbook text.`);
    deliveryMapFailure(errors);
  }

  const headings = extractTableOfContents(workbookMarkdown)
    .map((heading, index) => ({ ...heading, index }));
  const headingByAnchor = new Map(headings.map((heading) => [heading.id, heading]));
  const expectedSessions = bridgeEntry.sessionSpine;
  if (!Array.isArray(expectedSessions) || expectedSessions.length !== 6) {
    errors.push(`${label} canonical bridge must define exactly six sessions.`);
  }
  if (!Array.isArray(deliveryMap?.sessions) || deliveryMap.sessions.length !== 6) {
    errors.push(`${label} must declare exactly six hidden authoring sessions.`);
  }

  const sessionLikeHeadings = headings.filter(
    ({ depth, title }) => depth === 2 && /^Session\b/u.test(title),
  );
  const visibleSessionHeadings = sessionLikeHeadings.filter(
    ({ title }) => /^Session\s+[1-6]\b/u.test(title),
  );
  if (
    visibleSessionHeadings.length !== 6 ||
    sessionLikeHeadings.length !== visibleSessionHeadings.length
  ) {
    errors.push(`${label} hidden workbook must expose exactly six Session 1 through Session 6 headings and no undeclared Session headings.`);
  }

  const sessionHeadingsById = new Map();
  const allOutputs = [];
  if (Array.isArray(deliveryMap?.sessions) && Array.isArray(expectedSessions)) {
    const deliverySessionIds = new Set();
    const outputIds = new Set();
    const outputAnchors = new Set();
    const forwardArtifactIds = new Set();

    for (const [index, deliveredSession] of deliveryMap.sessions.entries()) {
      const expectedSession = expectedSessions[index];
      const sessionLabel = `${label} session ${index + 1}`;
      requireExactKeys(
        deliveredSession,
        ["id", "title", "sessionHeadingAnchor", "usesPrerequisiteModuleIds", "outputs"],
        sessionLabel,
        errors,
      );
      if (deliveredSession?.id !== expectedSession?.id || deliverySessionIds.has(deliveredSession?.id)) {
        errors.push(`${sessionLabel} ID must match the ordered canonical bridge exactly.`);
      }
      if (hasText(deliveredSession?.id)) deliverySessionIds.add(deliveredSession.id);
      if (deliveredSession?.title !== expectedSession?.title) {
        errors.push(`${sessionLabel} title must match the canonical bridge exactly.`);
      }
      if (!sameOrderedValues(deliveredSession?.usesPrerequisiteModuleIds, expectedSession?.usesPrerequisiteModuleIds)) {
        errors.push(`${sessionLabel} prerequisite use must match the canonical bridge exactly.`);
      }

      const sessionHeading = headingByAnchor.get(deliveredSession?.sessionHeadingAnchor);
      if (!sessionHeading || sessionHeading.depth !== 2) {
        errors.push(`${sessionLabel} must bind a visible h2 session heading in the hidden workbook.`);
      } else {
        const expectedSessionNumber = index + 1;
        if (!new RegExp(`^Session\\s+${expectedSessionNumber}\\b`, "u").test(sessionHeading.title)) {
          errors.push(`${sessionLabel} must bind the visible Session ${expectedSessionNumber} heading.`);
        }
        if (hasText(deliveredSession?.id)) sessionHeadingsById.set(deliveredSession.id, sessionHeading);
      }

      if (!Array.isArray(deliveredSession?.outputs) || deliveredSession.outputs.length === 0) {
        errors.push(`${sessionLabel} must declare at least one typed visible local output.`);
        continue;
      }
      for (const [outputIndex, output] of deliveredSession.outputs.entries()) {
        const outputLabel = `${sessionLabel} output ${outputIndex + 1}`;
        requireExactKeys(
          output,
          ["id", "kind", "headingAnchor", "forwardArtifactId"],
          outputLabel,
          errors,
        );
        if (!moduleArtifactIdentifier(output?.id, courseModule?.id) || outputIds.has(output?.id)) {
          errors.push(`${outputLabel}.id must be a unique module-scoped artifact identifier.`);
        }
        if (hasText(output?.id)) outputIds.add(output.id);
        if (!authoringOutputKinds.has(output?.kind)) {
          errors.push(`${outputLabel}.kind must be a supported typed local-output kind.`);
        }
        if (!hasText(output?.headingAnchor) || outputAnchors.has(output.headingAnchor)) {
          errors.push(`${outputLabel}.headingAnchor must be unique and non-empty.`);
        }
        if (hasText(output?.headingAnchor)) outputAnchors.add(output.headingAnchor);
        if (output?.forwardArtifactId !== null && output?.forwardArtifactId !== output?.id) {
          errors.push(`${outputLabel}.forwardArtifactId must be null or equal its output ID.`);
        }
        if (hasText(output?.forwardArtifactId) && forwardArtifactIds.has(output.forwardArtifactId)) {
          errors.push(`${outputLabel}.forwardArtifactId may not be declared more than once.`);
        }
        if (hasText(output?.forwardArtifactId)) forwardArtifactIds.add(output.forwardArtifactId);

        const outputHeading = headingByAnchor.get(output?.headingAnchor);
        if (!isVisibleOutputHeading(outputHeading)) {
          errors.push(`${outputLabel} must bind a visible h3 heading beginning "Output:".`);
        }
        allOutputs.push({ sessionId: deliveredSession?.id, output, outputHeading });
      }
    }

    const expectedArtifactIds = bridgeEntry.prerequisiteBridges?.map(
      ({ forwardArtifact }) => forwardArtifact?.id,
    ) ?? [];
    if (!sameMembers([...forwardArtifactIds], expectedArtifactIds)) {
      errors.push(`${label} must bind every canonical prerequisite bridge artifact exactly once.`);
    }
    for (const bridge of bridgeEntry.prerequisiteBridges ?? []) {
      const output = allOutputs.find(
        ({ output: candidate }) => candidate?.forwardArtifactId === bridge?.forwardArtifact?.id,
      );
      if (!output || output.sessionId !== bridge?.firstConsumingSessionId) {
        errors.push(
          `${label} must bind ${bridge?.forwardArtifact?.id ?? "the bridge artifact"} as a visible local output in its canonical first-consuming session.`,
        );
      }
    }

    for (const { sessionId, output, outputHeading } of allOutputs) {
      if (!outputHeading) continue;
      const declaredSessionHeading = sessionHeadingsById.get(sessionId);
      const containingH2Heading = nearestPrecedingH2Heading(headings, outputHeading.index);
      if (containingH2Heading?.id !== declaredSessionHeading?.id) {
        errors.push(
          `${label} output ${output?.id ?? "(missing ID)"} must appear inside its declared session rather than another session.`,
        );
      }
    }

    const mappedSessionAnchors = new Set(
      deliveryMap.sessions.map(({ sessionHeadingAnchor }) => sessionHeadingAnchor).filter(hasText),
    );
    for (const heading of visibleSessionHeadings) {
      if (!mappedSessionAnchors.has(heading.id)) {
        errors.push(`${label} has an orphan visible session heading #${heading.id}.`);
      }
    }

    const declaredOutputAnchors = new Set(
      allOutputs.map(({ output }) => output?.headingAnchor).filter(hasText),
    );
    for (const heading of headings.filter(isVisibleOutputHeading)) {
      if (!declaredOutputAnchors.has(heading.id)) {
        errors.push(`${label} has an orphan visible output heading #${heading.id}.`);
      }
    }

    const handoffOutput = allOutputs.find(
      ({ output }) => output?.id === deliveryMap?.localForwardHandoffOutputId,
    );
    const finalSessionId = expectedSessions.at(-1)?.id;
    if (!handoffOutput || handoffOutput.sessionId !== finalSessionId) {
      errors.push(`${label}.localForwardHandoffOutputId must resolve to a visible output in the final session.`);
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
  if (!sameOrderedValues(
    deliveryMap?.forwardHandoff?.directAcademicConsumerModuleIds,
    bridgeEntry.forwardHandoff?.directAcademicConsumerModuleIds,
  )) {
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
