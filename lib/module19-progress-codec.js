import { createPredictionProgressCodec } from "./local-progress-codec.js";

/**
 * M19's former v2 record retained simulator and context state that is outside
 * the local-progress privacy boundary. It is retired on read, never migrated.
 */
export const MODULE19_LEGACY_PROGRESS_STORAGE_KEY =
  "atlas-academy.module19-concurrency-studio.v2";

/**
 * The v3 record contains only the six fixed prediction gates. It is optional,
 * local, untrusted, and cannot demonstrate learner mastery.
 */
export const MODULE19_PROGRESS_STORAGE_KEY =
  "atlas-academy.module19-concurrency-studio.v3";

export const module19ProgressCodec = createPredictionProgressCodec({
  version: 3,
  viewIds: [
    "history",
    "linearization",
    "coordination",
    "progress",
    "models",
    "evidence",
  ],
  choiceIdsByView: {
    history: ["old", "lost", "both", "unknown"],
    linearization: ["write", "read-write", "logical", "gil"],
    coordination: ["published", "joined", "unfinished", "cancelled"],
    progress: ["always", "declared", "starvation", "timeout"],
    models: ["thread", "process", "async", "more"],
    evidence: ["futures", "exit", "stress", "oracle"],
  },
});

/**
 * A syntactically valid empty envelope is not learner progress. Keeping this
 * check beside the schema ensures restore and write callers use one privacy
 * boundary rather than independently deciding when a record is meaningful.
 *
 * @param {unknown} record
 */
export function hasMeaningfulModule19Progress(record) {
  if (!module19ProgressCodec.isRecord(record)) return false;
  return Object.values(record).some(
    (gate) =>
      gate.choice !== null || gate.confidence !== null || gate.revealed,
  );
}

/**
 * Restore only the current allowlisted envelope. The broad v2 record is
 * explicitly retired rather than converted, so synthetic histories, model
 * choices, patch decisions, and other context cannot enter the new record.
 * A malformed present v3 value is discarded rather than repaired.
 *
 * @param {{
 *   getItem: (key: string) => string | null,
 *   removeItem: (key: string) => void,
 * }} storage
 */
export function restoreModule19Progress(storage) {
  const rawCurrent = storage.getItem(MODULE19_PROGRESS_STORAGE_KEY);
  const currentRecord = module19ProgressCodec.parse(rawCurrent);

  if (
    rawCurrent !== null &&
    (!currentRecord || !hasMeaningfulModule19Progress(currentRecord))
  ) {
    storage.removeItem(MODULE19_PROGRESS_STORAGE_KEY);
  }
  storage.removeItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY);

  return currentRecord && hasMeaningfulModule19Progress(currentRecord)
    ? currentRecord
    : null;
}

/**
 * Remove both generations. The caller intentionally does not write an empty
 * replacement: page visits and resets must not create a default record.
 *
 * @param {{ removeItem: (key: string) => void }} storage
 */
export function clearModule19Progress(storage) {
  storage.removeItem(MODULE19_PROGRESS_STORAGE_KEY);
  storage.removeItem(MODULE19_LEGACY_PROGRESS_STORAGE_KEY);
}
