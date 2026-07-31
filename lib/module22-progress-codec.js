import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/** The existing v1 key and envelope remain the bounded M22 contract. */
export const MODULE22_PROGRESS_STORAGE_KEY =
  "atlas-academy.module22-security-trust.v1";

export const module22ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: [
    "boundary",
    "identity",
    "pipeline",
    "crypto",
    "provenance",
    "incident",
  ],
  choiceIdsByView: {
    boundary: ["correlation", "identity", "permission"],
    identity: ["tuple", "session", "trace"],
    pipeline: ["sink", "clean", "sanitize"],
    crypto: ["narrow", "blanket", "remote"],
    provenance: ["gap", "safe", "author"],
    incident: ["unknown", "failure", "dump"],
  },
});

/**
 * M22 keeps only its six confidence-aware prediction gates in optional local
 * browser storage. Blank or malformed current values are discarded rather
 * than being retained as learner evidence.
 */
export const module22ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE22_PROGRESS_STORAGE_KEY,
  codec: module22ProgressCodec,
});

export function restoreModule22Progress(storage) {
  return module22ProgressLifecycle.restore(storage);
}

export function persistModule22Progress(storage, record) {
  return module22ProgressLifecycle.persist(storage, record);
}

export function clearModule22Progress(storage) {
  return module22ProgressLifecycle.clear(storage);
}
