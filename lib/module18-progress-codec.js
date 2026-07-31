import { createVersionedProgressCodec } from "./local-progress-codec.js";

/**
 * M18's retired v2 record kept a broad simulator snapshot, including raw
 * inputs and exploratory context. It is deliberately cleared rather than
 * migrated into the narrower learner-evidence boundary.
 */
export const MODULE18_LEGACY_PROGRESS_STORAGE_KEY =
  "atlas-academy.module18-os-studio.v2";

/**
 * M18 v3 stores only the three context-bound prediction gates. It is local,
 * optional, untrusted, and never demonstrates learner mastery.
 */
export const MODULE18_PROGRESS_STORAGE_KEY =
  "atlas-academy.module18-os-studio.v3";

export const MODULE18_BOUNDARY_STEP_COUNT = 5;
export const MODULE18_PUBLICATION_PHASE_COUNT = 12;

const boundaryKeys = new Set(["step", "choice", "confidence", "revealed"]);
const translationKeys = new Set([
  "process",
  "virtualAddress",
  "access",
  "pte",
  "vpn",
  "offset",
  "outcome",
  "physical",
  "confidence",
  "revealed",
]);
const publicationKeys = new Set([
  "scenario",
  "phase",
  "choice",
  "confidence",
  "revealed",
]);
const recordKeys = new Set(["boundary", "translation", "publication"]);
const pageEntryKeys = new Set([
  "valid",
  "present",
  "frame",
  "permissions",
  "fileBacked",
]);
const confidenceLevels = new Set([1, 2, 3, 4]);
const boundaryChoices = new Set(["user", "crossing", "kernel"]);
const translationOutcomes = new Set([
  "mapped",
  "not-present",
  "protection",
  "invalid",
]);
const publicationChoices = new Set(["old", "new", "either", "unknown"]);
const processes = new Set(["A", "B"]);
const accessModes = new Set(["read", "write", "execute"]);
const publicationScenarios = new Set(["normal", "cooperative", "abrupt"]);

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function hasExactlyKeys(value, expectedKeys) {
  return (
    Object.keys(value).length === expectedKeys.size &&
    Object.keys(value).every((key) => expectedKeys.has(key))
  );
}

function isBoundedInteger(value, maximum) {
  return Number.isInteger(value) && value >= 0 && value <= maximum;
}

function normalizeNullableInteger(value, maximum) {
  return value === null || isBoundedInteger(value, maximum) ? value : undefined;
}

function normalizePageEntry(value) {
  if (value === null) return null;
  if (!isPlainRecord(value) || !hasExactlyKeys(value, pageEntryKeys)) {
    return undefined;
  }
  if (
    typeof value.valid !== "boolean" ||
    typeof value.present !== "boolean" ||
    (value.frame !== null && !isBoundedInteger(value.frame, 0xff)) ||
    typeof value.permissions !== "string" ||
    !/^[r-][w-][x-]$/u.test(value.permissions) ||
    typeof value.fileBacked !== "boolean"
  ) {
    return undefined;
  }
  return {
    valid: value.valid,
    present: value.present,
    frame: value.frame,
    permissions: value.permissions,
    fileBacked: value.fileBacked,
  };
}

function normalizeBoundary(value) {
  if (!isPlainRecord(value) || !hasExactlyKeys(value, boundaryKeys)) {
    return null;
  }
  if (
    !isBoundedInteger(value.step, MODULE18_BOUNDARY_STEP_COUNT - 1) ||
    (value.choice !== null &&
      (typeof value.choice !== "string" || !boundaryChoices.has(value.choice))) ||
    (value.confidence !== null && !confidenceLevels.has(value.confidence)) ||
    typeof value.revealed !== "boolean" ||
    (value.revealed && (value.choice === null || value.confidence === null))
  ) {
    return null;
  }
  return {
    step: value.step,
    choice: value.choice,
    confidence: value.confidence,
    revealed: value.revealed,
  };
}

function normalizeTranslation(value) {
  if (!isPlainRecord(value) || !hasExactlyKeys(value, translationKeys)) {
    return null;
  }
  const pte = normalizePageEntry(value.pte);
  const vpn = normalizeNullableInteger(value.vpn, 0xff);
  const offset = normalizeNullableInteger(value.offset, 0xff);
  const physical = normalizeNullableInteger(value.physical, 0xffff);
  if (
    !processes.has(value.process) ||
    !isBoundedInteger(value.virtualAddress, 0xffff) ||
    !accessModes.has(value.access) ||
    pte === undefined ||
    vpn === undefined ||
    offset === undefined ||
    physical === undefined ||
    (value.outcome !== null &&
      (typeof value.outcome !== "string" ||
        !translationOutcomes.has(value.outcome))) ||
    (value.confidence !== null && !confidenceLevels.has(value.confidence)) ||
    typeof value.revealed !== "boolean" ||
    (value.outcome !== "mapped" && physical !== null) ||
    (value.revealed &&
      (vpn === null ||
        offset === null ||
        value.outcome === null ||
        value.confidence === null ||
        (value.outcome === "mapped" && physical === null)))
  ) {
    return null;
  }
  return {
    process: value.process,
    virtualAddress: value.virtualAddress,
    access: value.access,
    pte,
    vpn,
    offset,
    outcome: value.outcome,
    physical,
    confidence: value.confidence,
    revealed: value.revealed,
  };
}

function normalizePublication(value) {
  if (!isPlainRecord(value) || !hasExactlyKeys(value, publicationKeys)) {
    return null;
  }
  if (
    !publicationScenarios.has(value.scenario) ||
    !isBoundedInteger(value.phase, MODULE18_PUBLICATION_PHASE_COUNT - 1) ||
    (value.choice !== null &&
      (typeof value.choice !== "string" ||
        !publicationChoices.has(value.choice))) ||
    (value.confidence !== null && !confidenceLevels.has(value.confidence)) ||
    typeof value.revealed !== "boolean" ||
    (value.revealed && (value.choice === null || value.confidence === null))
  ) {
    return null;
  }
  return {
    scenario: value.scenario,
    phase: value.phase,
    choice: value.choice,
    confidence: value.confidence,
    revealed: value.revealed,
  };
}

function normalizeModule18Record(value) {
  if (!isPlainRecord(value) || !hasExactlyKeys(value, recordKeys)) {
    return null;
  }
  const boundary = normalizeBoundary(value.boundary);
  const translation = normalizeTranslation(value.translation);
  const publication = normalizePublication(value.publication);
  if (!boundary || !translation || !publication) return null;
  return { boundary, translation, publication };
}

export const module18ProgressCodec = createVersionedProgressCodec({
  version: 3,
  normalizeRecord: normalizeModule18Record,
});

/**
 * A context alone is not local learner progress. The record becomes
 * meaningful only after an entered prediction, arithmetic value, confidence,
 * or reveal exists in one of its three fixed gates.
 *
 * @param {unknown} record
 */
export function hasMeaningfulModule18Progress(record) {
  if (!module18ProgressCodec.isRecord(record)) return false;
  const { boundary, translation, publication } = record;
  return (
    boundary.choice !== null ||
    boundary.confidence !== null ||
    boundary.revealed ||
    translation.vpn !== null ||
    translation.offset !== null ||
    translation.outcome !== null ||
    translation.physical !== null ||
    translation.confidence !== null ||
    translation.revealed ||
    publication.choice !== null ||
    publication.confidence !== null ||
    publication.revealed
  );
}

/**
 * Parse a learner-entered hexadecimal number without accepting partial text
 * such as `2Agarbage`. The UI and the persisted codec share this bound.
 *
 * @param {unknown} value
 * @param {number} maximum
 */
export function parseBoundedHexadecimal(value, maximum) {
  if (typeof value !== "string" || !isBoundedInteger(maximum, 0xffff)) {
    return null;
  }
  const match = /^(?:0x)?([0-9a-f]+)$/iu.exec(value);
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 16);
  return isBoundedInteger(parsed, maximum) ? parsed : null;
}

/**
 * Restore only the v3 allowlisted record. The broader v2 snapshot is retired
 * on every read. A present blank, malformed, stale, or expanded v3 record is
 * cleared together with v2 and never triggers a fallback.
 *
 * @param {{
 *   getItem: (key: string) => string | null,
 *   removeItem: (key: string) => void,
 * }} storage
 */
export function restoreModule18Progress(storage) {
  const rawCurrent = storage.getItem(MODULE18_PROGRESS_STORAGE_KEY);
  const currentRecord = module18ProgressCodec.parse(rawCurrent);
  if (rawCurrent !== null) {
    if (currentRecord && hasMeaningfulModule18Progress(currentRecord)) {
      try {
        storage.removeItem(MODULE18_LEGACY_PROGRESS_STORAGE_KEY);
      } catch {
        // Storage is optional; current in-memory learning remains usable.
      }
      return currentRecord;
    }
    try {
      clearModule18Progress(storage);
    } catch {
      // Fail closed in memory even if the browser refuses a cleanup write.
    }
    return null;
  }
  try {
    storage.removeItem(MODULE18_LEGACY_PROGRESS_STORAGE_KEY);
  } catch {
    // The v2 record is never used to restore learning state.
  }
  return null;
}

/**
 * Persist only meaningful context-bound learner evidence. A blank studio is
 * intentionally absent from storage on first visit and after a reset.
 *
 * @param {{
 *   setItem: (key: string, value: string) => void,
 *   removeItem: (key: string) => void,
 * }} storage
 * @param {unknown} record
 */
export function persistModule18Progress(storage, record) {
  if (!hasMeaningfulModule18Progress(record)) return false;
  storage.setItem(
    MODULE18_PROGRESS_STORAGE_KEY,
    module18ProgressCodec.serialize(record),
  );
  storage.removeItem(MODULE18_LEGACY_PROGRESS_STORAGE_KEY);
  return true;
}

/**
 * Reset both storage generations. Callers settle into in-memory defaults
 * without writing a replacement envelope.
 *
 *
 * @param {{ removeItem: (key: string) => void }} storage
 */
export function clearModule18Progress(storage) {
  storage.removeItem(MODULE18_PROGRESS_STORAGE_KEY);
  storage.removeItem(MODULE18_LEGACY_PROGRESS_STORAGE_KEY);
}
