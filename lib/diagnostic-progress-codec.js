import {
  DIAGNOSTIC_LEGACY_STORAGE_KEY,
  DIAGNOSTIC_STORAGE_KEY,
  createEmptyAttempt,
  diagnosticQuestions,
  parseStoredAttempt,
} from "./diagnostic-model.js";
import {
  createPredictionProgressCodec,
  storageOperationSucceeded,
} from "./local-progress-codec.js";

/** A full v2 DiagnosticAttempt is migration-only and is never re-persisted. */
export const DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY =
  DIAGNOSTIC_LEGACY_STORAGE_KEY;
/** v3 contains only the fixed, allowlisted intake triads. */
export const DIAGNOSTIC_PROGRESS_STORAGE_KEY = DIAGNOSTIC_STORAGE_KEY;

const diagnosticQuestionIds = diagnosticQuestions.map(({ id }) => id);
const choiceIdsByQuestion = Object.fromEntries(
  diagnosticQuestions.map((question) => [
    question.id,
    question.options.map((option) => option.id),
  ]),
);

export const diagnosticProgressCodec = createPredictionProgressCodec({
  version: 3,
  viewIds: diagnosticQuestionIds,
  choiceIdsByView: choiceIdsByQuestion,
  confidenceLevels: ["low", "medium", "high"],
});

/**
 * Project the rich, in-memory diagnostic attempt onto the only information
 * that may remain in browser storage: all 20 fixed prediction triads. The
 * assessment version, navigation position, completion flag, timestamps,
 * results, and export-consent state deliberately remain in memory.
 *
 * @param {unknown} attempt
 */
export function attemptToDiagnosticProgress(attempt) {
  const parsedAttempt = parseStoredAttempt(attempt);
  if (!parsedAttempt) {
    throw new TypeError("Cannot persist an invalid diagnostic attempt.");
  }

  const record = Object.fromEntries(
    diagnosticQuestions.map((question) => {
      const response = parsedAttempt.responsesByQuestionId[question.id];
      return [
        question.id,
        {
          choice: response?.optionId ?? null,
          confidence: response?.confidence ?? null,
          revealed: response?.revealed === true,
        },
      ];
    }),
  );
  if (!diagnosticProgressCodec.isRecord(record)) {
    throw new TypeError("Cannot persist diagnostic progress outside its v3 contract.");
  }
  return record;
}

/**
 * A blank triad grid is initial UI state, not learner evidence. One selected
 * option, selected confidence label, or revealed explanation is enough to
 * make the locally held record meaningful.
 *
 * @param {unknown} record
 */
export function hasMeaningfulDiagnosticProgress(record) {
  if (!diagnosticProgressCodec.isRecord(record)) return false;
  return Object.values(record).some(
    ({ choice, confidence, revealed }) =>
      choice !== null || confidence !== null || revealed,
  );
}

/**
 * Rebuild transient diagnostic state from fixed local evidence. Resume starts
 * at the first unrevealed question; a fully revealed record goes directly to
 * the in-memory results state. No stored timestamp or navigation position is
 * accepted.
 *
 * @param {unknown} record
 * @param {string} [updatedAt]
 */
export function diagnosticProgressToAttempt(
  record,
  updatedAt = new Date().toISOString(),
) {
  if (!diagnosticProgressCodec.isRecord(record)) return null;
  const responsesByQuestionId = {};
  for (const question of diagnosticQuestions) {
    const gate = record[question.id];
    if (gate.choice !== null || gate.confidence !== null || gate.revealed) {
      responsesByQuestionId[question.id] = {
        ...(gate.choice !== null ? { optionId: gate.choice } : {}),
        ...(gate.confidence !== null ? { confidence: gate.confidence } : {}),
        revealed: gate.revealed,
      };
    }
  }
  const firstUnrevealed = diagnosticQuestions.find(
    (question) => !record[question.id].revealed,
  );
  return {
    ...createEmptyAttempt(updatedAt),
    currentQuestionId: firstUnrevealed?.id ?? diagnosticQuestions[0].id,
    responsesByQuestionId,
    completed: firstUnrevealed === undefined,
  };
}

/**
 * Restore v3 first. A present malformed or blank v3 record clears both key
 * generations and never revives the broad v2 attempt. A valid v2 attempt is
 * projected into v3 before v2 is removed; if that write fails, the derived
 * attempt remains available only for the current in-memory visit.
 *
 * @param {{
 *   getItem: (key: string) => string | null,
 *   setItem: (key: string, value: string) => boolean | void,
 *   removeItem: (key: string) => boolean | void,
 * }} storage
 * @param {string} [updatedAt]
 */
export function restoreDiagnosticProgress(
  storage,
  updatedAt = new Date().toISOString(),
) {
  const rawCurrent = storage.getItem(DIAGNOSTIC_PROGRESS_STORAGE_KEY);
  const currentRecord = diagnosticProgressCodec.parse(rawCurrent);
  if (rawCurrent !== null) {
    if (currentRecord && hasMeaningfulDiagnosticProgress(currentRecord)) {
      try {
        storage.removeItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY);
      } catch {
        // Storage remains optional after a valid in-memory restore.
      }
      return diagnosticProgressToAttempt(currentRecord, updatedAt);
    }
    try {
      clearDiagnosticProgress(storage);
    } catch {
      // Fail closed in memory if browser cleanup is blocked.
    }
    return null;
  }

  const rawLegacy = storage.getItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY);
  const legacyAttempt = parseStoredAttempt(rawLegacy);
  if (!legacyAttempt) {
    if (rawLegacy !== null) {
      try {
        storage.removeItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY);
      } catch {
        // Ignore retired malformed state when a browser blocks cleanup.
      }
    }
    return null;
  }
  const legacyRecord = attemptToDiagnosticProgress(legacyAttempt);
  if (!hasMeaningfulDiagnosticProgress(legacyRecord)) {
    try {
      storage.removeItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY);
    } catch {
      // Never manufacture a v3 default for a blank legacy shell.
    }
    return null;
  }

  const restoredAttempt = diagnosticProgressToAttempt(legacyRecord, updatedAt);
  try {
    if (
      storageOperationSucceeded(
        storage.setItem(
          DIAGNOSTIC_PROGRESS_STORAGE_KEY,
          diagnosticProgressCodec.serialize(legacyRecord),
        ),
      )
    ) {
      storage.removeItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY);
    }
  } catch {
    // Keep valid v2 data untouched when migration storage fails.
  }
  return restoredAttempt;
}

/**
 * Persist only meaningful v3 triads. Empty attempts do not create a default
 * storage envelope on first visit or after reset.
 *
 * @param {{
 *   setItem: (key: string, value: string) => boolean | void,
 *   removeItem: (key: string) => boolean | void,
 * }} storage
 * @param {unknown} attempt
 */
export function persistDiagnosticProgress(storage, attempt) {
  const record = attemptToDiagnosticProgress(attempt);
  if (!hasMeaningfulDiagnosticProgress(record)) return false;
  if (
    !storageOperationSucceeded(
      storage.setItem(
        DIAGNOSTIC_PROGRESS_STORAGE_KEY,
        diagnosticProgressCodec.serialize(record),
      ),
    )
  ) {
    return false;
  }
  storage.removeItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY);
  return true;
}

/** @param {{ removeItem: (key: string) => boolean | void }} storage */
export function clearDiagnosticProgress(storage) {
  const currentRemoved = storageOperationSucceeded(
    storage.removeItem(DIAGNOSTIC_PROGRESS_STORAGE_KEY),
  );
  const legacyRemoved = storageOperationSucceeded(
    storage.removeItem(DIAGNOSTIC_LEGACY_PROGRESS_STORAGE_KEY),
  );
  return currentRemoved && legacyRemoved;
}
