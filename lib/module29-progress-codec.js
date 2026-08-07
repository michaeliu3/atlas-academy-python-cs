import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/**
 * This is the existing M29 browser key and v1 envelope boundary. It retains
 * only the fixed prediction gates, never the active view or teaching context.
 */
export const MODULE29_PROGRESS_STORAGE_KEY =
  "atlas.module29.continuous-change-studio.v1";

export const module29ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["limit", "local", "area", "chain", "convergence", "trajectory"],
  choiceIdsByView: {
    limit: ["removable", "value-controls-limit", "graph-proof"],
    local: ["forward-boundary", "any-h-proves", "automatic-best"],
    area: ["absolute-determinant", "signed-area", "det-optional"],
    chain: ["row-gradient", "transpose-free", "autodiff-proof"],
    convergence: [
      "pointwise-not-uniform",
      "pointwise-is-uniform",
      "finite-grid-exchange",
    ],
    trajectory: [
      "candidate-not-certificate",
      "multiplier-solves-all",
      "refinement-proves",
    ],
  },
});

/**
 * Blank, malformed, and expanded current records are removed on restore.
 * A fresh visit and a learner reset leave no replacement storage record.
 */
const module29ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE29_PROGRESS_STORAGE_KEY,
  codec: module29ProgressCodec,
});

export function restoreModule29Progress(storage) {
  return module29ProgressLifecycle.restore(storage);
}

export function persistModule29Progress(storage, record) {
  return module29ProgressLifecycle.persist(storage, record);
}

export function clearModule29Progress(storage) {
  return module29ProgressLifecycle.clear(storage);
}
