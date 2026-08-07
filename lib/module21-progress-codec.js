import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/** The existing v1 key and envelope remain the bounded M21 contract. */
export const MODULE21_PROGRESS_STORAGE_KEY =
  "atlas-academy.module21-run-control.v1";

export const module21ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["task", "scope", "pressure", "reconcile", "order", "audit"],
  choiceIdsByView: {
    task: ["owned", "received", "self"],
    scope: ["scope", "rollback", "full"],
    pressure: ["slot", "capacity", "rollback"],
    reconcile: ["same", "new", "failed"],
    order: ["local", "causal", "fresh"],
    audit: ["full", "global", "trust"],
  },
});

/**
 * M21 retains only its six fixed prediction gates. Storage failures leave the
 * local lesson usable in memory; malformed and blank browser values fail
 * closed without creating a replacement envelope.
 */
export const module21ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE21_PROGRESS_STORAGE_KEY,
  codec: module21ProgressCodec,
});

export function restoreModule21Progress(storage) {
  return module21ProgressLifecycle.restore(storage);
}

export function persistModule21Progress(storage, record) {
  return module21ProgressLifecycle.persist(storage, record);
}

export function clearModule21Progress(storage) {
  return module21ProgressLifecycle.clear(storage);
}
