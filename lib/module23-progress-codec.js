import {
  createPredictionProgressCodec,
  storageOperationSucceeded,
} from "./local-progress-codec.js";

/**
 * M23 retains only its six fixed prediction checkpoints in browser storage.
 * The v2 key distinguishes the shared-codec envelope from the legacy raw v1
 * record; neither form is evidence of mastery.
 */
export const MODULE23_PROGRESS_STORAGE_KEY =
  "atlas-academy.module23-language-lab.v2";
export const MODULE23_LEGACY_PROGRESS_STORAGE_KEY =
  "atlas-academy.module23-language-lab.v1";

export const module23ProgressCodec = createPredictionProgressCodec({
  version: 2,
  viewIds: ["boundary", "grammar", "environment", "semantics", "contract", "bridge"],
  choiceIdsByView: {
    boundary: ["syntax", "permission", "execution"],
    grammar: ["multiply", "add", "flat"],
    environment: ["captured", "caller", "host"],
    semantics: ["selected", "both", "missing"],
    contract: ["named", "parse", "adapter"],
    bridge: ["observation", "law", "benchmark"],
  },
});

/**
 * An all-empty record is a useful in-memory starting point, but it is not
 * learner progress and must not create a browser-storage record by itself.
 *
 * @param {unknown} record
 */
export function hasModule23MeaningfulProgress(record) {
  if (!module23ProgressCodec.isRecord(record)) return false;
  return Object.values(record).some(
    (entry) =>
      entry.choice !== null ||
      entry.confidence !== null ||
      entry.revealed,
  );
}

/**
 * Parse one exact raw v1 record during the bounded key migration. The current
 * v2 codec never accepts a bare record; callers must use this only when no v2
 * value exists, then persist the returned value through `serialize`.
 *
 * @param {unknown} raw
 */
export function parseModule23LegacyProgress(raw) {
  if (typeof raw !== "string") return null;
  try {
    return module23ProgressCodec.parse(
      JSON.stringify({
        version: module23ProgressCodec.version,
        record: JSON.parse(raw),
      }),
    );
  } catch {
    return null;
  }
}

/**
 * Restore bounded M23 prediction evidence through one current-first lifecycle.
 * A present v2 value, including a malformed or blank one, is never a cue to
 * revive v1. When v2 is absent, a meaningful exact v1 record is migrated by
 * writing v2 before removing v1. Empty or malformed data is discarded rather
 * than turned into a default browser record.
 *
 * @param {{
 *   getItem: (key: string) => string | null,
 *   setItem: (key: string, value: string) => boolean | void,
 *   removeItem: (key: string) => boolean | void,
 * }} storage
 */
export function restoreModule23Progress(storage) {
  const rawCurrent = storage.getItem(MODULE23_PROGRESS_STORAGE_KEY);
  const currentRecord = module23ProgressCodec.parse(rawCurrent);
  if (rawCurrent !== null) {
    if (!hasModule23MeaningfulProgress(currentRecord)) {
      clearModule23Progress(storage);
      return null;
    }
    return currentRecord;
  }

  const rawLegacy = storage.getItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
  const legacyRecord = parseModule23LegacyProgress(rawLegacy);
  if (!legacyRecord) {
    if (rawLegacy !== null) {
      storage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
    }
    return null;
  }
  if (!hasModule23MeaningfulProgress(legacyRecord)) {
    storage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
    return null;
  }

  try {
    if (
      storageOperationSucceeded(
        storage.setItem(
          MODULE23_PROGRESS_STORAGE_KEY,
          module23ProgressCodec.serialize(legacyRecord),
        ),
      )
    ) {
      storage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
    }
  } catch {
    // Browser storage is optional; valid v1 evidence still supports this visit.
  }
  return legacyRecord;
}

/**
 * Retain only learner-entered M23 prediction evidence. Clearing the last
 * checkpoint removes both declared generations and deliberately does not
 * manufacture an empty v2 envelope.
 *
 * @param {{
 *   setItem: (key: string, value: string) => boolean | void,
 *   removeItem: (key: string) => boolean | void,
 * }} storage
 * @param {unknown} record
 */
export function persistModule23Progress(storage, record) {
  if (!hasModule23MeaningfulProgress(record)) {
    clearModule23Progress(storage);
    return false;
  }

  if (
    !storageOperationSucceeded(
      storage.setItem(
        MODULE23_PROGRESS_STORAGE_KEY,
        module23ProgressCodec.serialize(record),
      ),
    )
  ) {
    return false;
  }
  storage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
  return true;
}

/**
 * Reset all declared M23 local-progress generations. The blank UI state stays
 * in memory until a learner makes a new bounded prediction.
 *
 * @param {{ removeItem: (key: string) => boolean | void }} storage
 */
export function clearModule23Progress(storage) {
  const currentRemoved = storageOperationSucceeded(
    storage.removeItem(MODULE23_PROGRESS_STORAGE_KEY),
  );
  const legacyRemoved = storageOperationSucceeded(
    storage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY),
  );
  return currentRemoved && legacyRemoved;
}
