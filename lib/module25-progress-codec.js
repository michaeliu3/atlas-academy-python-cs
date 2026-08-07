import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/**
 * The retired v1 key is removed on read, write, and reset. It is never
 * migrated: browser state is optional, untrusted, and not mastery evidence.
 */
export const MODULE25_LEGACY_PROGRESS_STORAGE_KEY =
  "atlas-academy.module25-evidence-studio.v1";

/** M25 keeps only the six prediction gates in this exact v2 envelope. */
export const MODULE25_PROGRESS_STORAGE_KEY =
  "atlas-academy.module25-evidence-studio.v2";

export const module25ProgressCodec = createPredictionProgressCodec({
  version: 2,
  viewIds: ["purpose", "lineage", "ranking", "evaluation", "control", "agent"],
  choiceIdsByView: {
    purpose: ["optional", "automatic", "engagement"],
    lineage: ["before", "after", "all"],
    ranking: ["set", "score", "click"],
    evaluation: ["bounded", "truth", "fair"],
    control: ["person", "policy", "score"],
    agent: ["proposal", "permission", "citation"],
  },
});

export const module25ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE25_PROGRESS_STORAGE_KEY,
  codec: module25ProgressCodec,
  retiredStorageKeys: [MODULE25_LEGACY_PROGRESS_STORAGE_KEY],
});

export function restoreModule25Progress(storage) {
  return module25ProgressLifecycle.restore(storage);
}

export function persistModule25Progress(storage, record) {
  return module25ProgressLifecycle.persist(storage, record);
}

export function clearModule25Progress(storage) {
  return module25ProgressLifecycle.clear(storage);
}
