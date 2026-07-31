import {
  createPredictionProgressCodec,
  storageOperationSucceeded,
} from "./local-progress-codec.js";

export const MODULE24_LEGACY_PROGRESS_STORAGE_KEY =
  "atlas-academy.module24-runtime-observatory.v1";
export const MODULE24_PROGRESS_STORAGE_KEY =
  "atlas-academy.module24-runtime-observatory.v2";

export const module24ProgressCodec = createPredictionProgressCodec({
  version: 2,
  viewIds: ["contract", "graph", "cycle", "lens", "runtime", "decision"],
  choiceIdsByView: {
    contract: ["semantic", "timing", "global"],
    graph: ["audit", "deleted", "address"],
    cycle: ["model", "resource", "immediate"],
    lens: ["traced", "rss", "all"],
    runtime: ["pinned", "language", "speed"],
    decision: ["defer", "accept", "ignore"],
  },
});

/**
 * Read the exact legacy bare record only to make a one-time local migration.
 * It is never accepted as current progress and no malformed v2 record may
 * fall back to this parser.
 */
export function parseModule24LegacyProgress(raw) {
  if (typeof raw !== "string") return null;
  try {
    const legacyRecord = JSON.parse(raw);
    if (!module24ProgressCodec.isRecord(legacyRecord)) return null;
    return module24ProgressCodec.parse(
      module24ProgressCodec.serialize(legacyRecord),
    );
  } catch {
    return null;
  }
}

/**
 * A blank checkpoint grid is the default UI state, not learner progress. A
 * selected answer, selected confidence level, or revealed evidence is the
 * minimum local evidence worth retaining.
 *
 * @param {unknown} record
 */
export function hasModule24MeaningfulProgress(record) {
  if (!module24ProgressCodec.isRecord(record)) return false;
  return Object.values(record).some(
    ({ choice, confidence, revealed }) =>
      choice !== null || confidence !== null || revealed,
  );
}

/**
 * Restore bounded M24 progress through the only supported storage path. A
 * malformed present v2 value fails closed and is never a cue to revive a
 * legacy record. A meaningful valid legacy record is written to v2 before v1
 * is removed; a blank legacy shell is removed without creating a v2 default.
 *
 * @param {{
 *   getItem: (key: string) => string | null,
 *   setItem: (key: string, value: string) => boolean | void,
 *   removeItem: (key: string) => boolean | void,
 * }} storage
 */
export function restoreModule24Progress(storage) {
  const rawCurrent = storage.getItem(MODULE24_PROGRESS_STORAGE_KEY);
  const currentRecord = module24ProgressCodec.parse(rawCurrent);
  if (rawCurrent !== null) {
    if (!hasModule24MeaningfulProgress(currentRecord)) {
      try {
        clearModule24Progress(storage);
      } catch {
        // Browser storage is optional; do not revive legacy data in memory.
      }
      return null;
    }
    return currentRecord;
  }

  const rawLegacy = storage.getItem(MODULE24_LEGACY_PROGRESS_STORAGE_KEY);
  const legacyRecord = parseModule24LegacyProgress(rawLegacy);
  if (!legacyRecord) {
    if (rawLegacy !== null) {
      try {
        storage.removeItem(MODULE24_LEGACY_PROGRESS_STORAGE_KEY);
      } catch {
        // Browser storage is optional; no invalid progress is revived.
      }
    }
    return null;
  }
  if (!hasModule24MeaningfulProgress(legacyRecord)) {
    try {
      storage.removeItem(MODULE24_LEGACY_PROGRESS_STORAGE_KEY);
    } catch {
      // Browser storage is optional; never create v2 state for a blank shell.
    }
    return null;
  }

  try {
    if (
      storageOperationSucceeded(
        storage.setItem(
          MODULE24_PROGRESS_STORAGE_KEY,
          module24ProgressCodec.serialize(legacyRecord),
        ),
      )
    ) {
      storage.removeItem(MODULE24_LEGACY_PROGRESS_STORAGE_KEY);
    }
  } catch {
    // A valid legacy record may still support this in-memory visit.
  }
  return legacyRecord;
}

/**
 * Persist only learner-entered prediction evidence. In particular, do not
 * manufacture an empty v2 envelope on first render or after a reset.
 *
 * @param {{ setItem: (key: string, value: string) => boolean | void }} storage
 * @param {unknown} record
 */
export function persistModule24Progress(storage, record) {
  if (!hasModule24MeaningfulProgress(record)) {
    clearModule24Progress(storage);
    return false;
  }
  if (
    !storageOperationSucceeded(
      storage.setItem(
        MODULE24_PROGRESS_STORAGE_KEY,
        module24ProgressCodec.serialize(record),
      ),
    )
  ) {
    return false;
  }
  storage.removeItem(MODULE24_LEGACY_PROGRESS_STORAGE_KEY);
  return true;
}

/**
 * Reset both bounded local-storage generations. The UI may settle into a
 * blank in-memory record without writing another browser entry.
 *
 * @param {{ removeItem: (key: string) => boolean | void }} storage
 */
export function clearModule24Progress(storage) {
  const currentRemoved = storageOperationSucceeded(
    storage.removeItem(MODULE24_PROGRESS_STORAGE_KEY),
  );
  const legacyRemoved = storageOperationSucceeded(
    storage.removeItem(MODULE24_LEGACY_PROGRESS_STORAGE_KEY),
  );
  return currentRemoved && legacyRemoved;
}
