import { createPredictionProgressCodec } from "./local-progress-codec.js";

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
