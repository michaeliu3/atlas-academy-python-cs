import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/** The existing v1 key and envelope remain the bounded M20 contract. */
export const MODULE20_PROGRESS_STORAGE_KEY =
  "atlas-academy.module20-protocol-studio.v1";

export const module20ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["naming", "framing", "evidence", "http", "retry", "audit"],
  choiceIdsByView: {
    naming: ["candidate", "reachable", "identity"],
    framing: ["frame", "chunk", "eof"],
    evidence: ["unknown", "rollback", "published"],
    http: ["atlas", "post", "key"],
    retry: ["same", "new", "changed"],
    audit: ["timeout", "framework", "boolean"],
  },
});

/**
 * M20 retains only its six allowlisted prediction gates. Browser storage is
 * optional and untrusted; malformed or blank records are removed rather than
 * becoming a default progress envelope.
 */
export const module20ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE20_PROGRESS_STORAGE_KEY,
  codec: module20ProgressCodec,
});

export function restoreModule20Progress(storage) {
  return module20ProgressLifecycle.restore(storage);
}

export function persistModule20Progress(storage, record) {
  return module20ProgressLifecycle.persist(storage, record);
}

export function clearModule20Progress(storage) {
  return module20ProgressLifecycle.clear(storage);
}
