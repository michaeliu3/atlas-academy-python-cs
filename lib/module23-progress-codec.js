import { createPredictionProgressCodec } from "./local-progress-codec.js";

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
