import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/**
 * This is the existing M28 browser key and v1 envelope boundary. It retains
 * only the fixed prediction gates, never the active view or teaching context.
 */
export const MODULE28_PROGRESS_STORAGE_KEY =
  "atlas.module28.linear-algebra-stability-studio.v1";

export const module28ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["space", "map", "projection", "spectrum", "stability", "pca"],
  choiceIdsByView: {
    space: ["not-subspace", "subspace-line", "basis-only"],
    map: ["kernel", "first-column", "all-inputs"],
    projection: ["columns", "response", "coefficients"],
    spectrum: ["orthogonal-eigenbasis", "all-square", "invertible-only"],
    stability: ["sensitivity", "residual-proof", "condition-algorithm"],
    pca: ["named-loss", "importance", "causality"],
  },
});

/**
 * Blank, malformed, and expanded current records are removed on restore.
 * A fresh visit and a learner reset leave no replacement storage record.
 */
const module28ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE28_PROGRESS_STORAGE_KEY,
  codec: module28ProgressCodec,
});

export function restoreModule28Progress(storage) {
  return module28ProgressLifecycle.restore(storage);
}

export function persistModule28Progress(storage, record) {
  return module28ProgressLifecycle.persist(storage, record);
}

export function clearModule28Progress(storage) {
  return module28ProgressLifecycle.clear(storage);
}
