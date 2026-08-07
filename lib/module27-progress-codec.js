import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/**
 * This is the existing M27 browser key and v1 envelope boundary. It retains
 * only the fixed prediction gates, never the active view or teaching context.
 */
export const MODULE27_PROGRESS_STORAGE_KEY =
  "atlas.module27.proof-counterexample-studio.v1";

export const module27ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["scope", "proof", "invariant", "count", "graph", "order"],
  choiceIdsByView: {
    scope: ["forall-exists", "exists-forall", "same"],
    proof: ["base", "more-code", "diagram"],
    invariant: ["obligations", "samples", "measure"],
    count: ["partition", "values", "convergence"],
    graph: ["maximal", "maximum", "invalid"],
    order: ["every-pair", "top-bottom", "comparability"],
  },
});

/**
 * Blank, malformed, and expanded current records are removed on restore.
 * A fresh visit and a learner reset leave no replacement storage record.
 */
const module27ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE27_PROGRESS_STORAGE_KEY,
  codec: module27ProgressCodec,
});

export function restoreModule27Progress(storage) {
  return module27ProgressLifecycle.restore(storage);
}

export function persistModule27Progress(storage, record) {
  return module27ProgressLifecycle.persist(storage, record);
}

export function clearModule27Progress(storage) {
  return module27ProgressLifecycle.clear(storage);
}
