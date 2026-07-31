import { createPredictionProgressCodec } from "./local-progress-codec.js";

/**
 * M26 retains only its six fixed prediction checkpoints in browser storage.
 * The v2 key distinguishes the shared-codec envelope from its bare v1 record;
 * neither form is learner identity, a dossier, or evidence of mastery.
 */
export const MODULE26_LEGACY_PROGRESS_STORAGE_KEY =
  "atlas-academy.module26-capstone-defense.v1";
export const MODULE26_PROGRESS_STORAGE_KEY =
  "atlas-academy.module26-capstone-defense.v2";

export const module26ProgressCodec = createPredictionProgressCodec({
  version: 2,
  viewIds: ["brief", "threads", "failure", "patch", "ledger", "board"],
  choiceIdsByView: {
    brief: ["bounded", "demo", "metric"],
    threads: ["trace", "diagram", "folders"],
    failure: ["idempotent", "timeout", "lock"],
    patch: ["review", "merge", "ban"],
    ledger: ["scoped", "quality", "security"],
    board: ["defer", "release", "confidence"],
  },
});

/**
 * Read one exact bare v1 record during the bounded key migration. The current
 * v2 codec never accepts a bare record; callers must use this only when the
 * v2 key is absent, then write its serialized result before removing v1.
 *
 * @param {unknown} raw
 */
export function parseModule26LegacyProgress(raw) {
  if (typeof raw !== "string") return null;
  try {
    const legacyRecord = JSON.parse(raw);
    if (!module26ProgressCodec.isRecord(legacyRecord)) return null;
    return module26ProgressCodec.parse(
      module26ProgressCodec.serialize(legacyRecord),
    );
  } catch {
    return null;
  }
}

/**
 * Restore bounded M26 progress through the only supported storage path. A
 * malformed present v2 value is ignored and fails closed: it remains untouched
 * and is never a cue to revive older data. A meaningful valid legacy record is
 * available in memory even when a browser blocks the one-time v2 write; v1 is
 * removed only after that write. A blank legacy shell is removed without a v2
 * write because it contains no learner evidence. A valid blank v2 envelope is
 * also no learner evidence, so both generations are cleared rather than
 * allowing stale v1 state to resurface on a later visit.
 *
 * @param {{
 *   getItem: (key: string) => string | null,
 *   setItem: (key: string, value: string) => void,
 *   removeItem: (key: string) => void,
 * }} storage
 */
export function restoreModule26Progress(storage) {
  const rawCurrent = storage.getItem(MODULE26_PROGRESS_STORAGE_KEY);
  const currentRecord = module26ProgressCodec.parse(rawCurrent);
  if (currentRecord) {
    if (!hasModule26MeaningfulProgress(currentRecord)) {
      try {
        clearModule26Progress(storage);
      } catch {
        // Browser storage is optional; do not revive legacy data in memory.
      }
      return null;
    }
    return currentRecord;
  }
  if (rawCurrent !== null) return null;

  const legacyRecord = parseModule26LegacyProgress(
    storage.getItem(MODULE26_LEGACY_PROGRESS_STORAGE_KEY),
  );
  if (!legacyRecord) return null;
  if (!hasModule26MeaningfulProgress(legacyRecord)) {
    try {
      storage.removeItem(MODULE26_LEGACY_PROGRESS_STORAGE_KEY);
    } catch {
      // Browser storage is optional; never create v2 state for a blank shell.
    }
    return null;
  }

  try {
    storage.setItem(
      MODULE26_PROGRESS_STORAGE_KEY,
      module26ProgressCodec.serialize(legacyRecord),
    );
    storage.removeItem(MODULE26_LEGACY_PROGRESS_STORAGE_KEY);
  } catch {
    // A valid legacy record may still support this in-memory visit.
  }
  return legacyRecord;
}

/**
 * A blank checkpoint grid is the default UI state, not learner progress. A
 * selected answer, selected confidence level, or revealed evidence makes the
 * record meaningful enough to retain locally.
 *
 * @param {unknown} record
 */
export function hasModule26MeaningfulProgress(record) {
  if (!module26ProgressCodec.isRecord(record)) return false;
  return Object.values(record).some(
    ({ choice, confidence, revealed }) =>
      choice !== null || confidence !== null || revealed,
  );
}

/**
 * Persist only learner-entered M26 prediction evidence. In particular, do not
 * manufacture an empty v2 envelope on first render or after a reset.
 *
 * @param {{ setItem: (key: string, value: string) => void }} storage
 * @param {unknown} record
 */
export function persistModule26Progress(storage, record) {
  if (!hasModule26MeaningfulProgress(record)) return false;
  storage.setItem(
    MODULE26_PROGRESS_STORAGE_KEY,
    module26ProgressCodec.serialize(record),
  );
  return true;
}

/**
 * Reset both generations of the bounded local record. The caller may then
 * settle an empty in-memory state without writing a new envelope.
 *
 * @param {{ removeItem: (key: string) => void }} storage
 */
export function clearModule26Progress(storage) {
  storage.removeItem(MODULE26_PROGRESS_STORAGE_KEY);
  storage.removeItem(MODULE26_LEGACY_PROGRESS_STORAGE_KEY);
}
