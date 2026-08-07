import {
  createPredictionProgressCodec,
  createPredictionProgressLifecycle,
} from "./local-progress-codec.js";

/**
 * This is the existing M30 browser key and v1 envelope boundary. It retains
 * only the fixed prediction gates, never the active view or teaching context.
 */
export const MODULE30_PROGRESS_STORAGE_KEY =
  "atlas.module30.probability-inference-studio.v1";

export const module30ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: [
    "base-rate",
    "variation",
    "repetition",
    "likelihood",
    "procedure",
    "design",
  ],
  choiceIdsByView: {
    "base-rate": [
      "conditional-update",
      "sensitivity-is-posterior",
      "joint-is-posterior",
    ],
    variation: [
      "same-mean-different-risk",
      "same-mean-same-law",
      "zero-covariance-cause",
    ],
    repetition: [
      "finite-not-theorem",
      "settled-proves-iid",
      "clt-means-normal-data",
    ],
    likelihood: [
      "prior-changes-posterior",
      "likelihood-parameter-probability",
      "fit-proves-cause",
    ],
    procedure: [
      "procedure-meaning",
      "interval-parameter-probability",
      "smallest-p-is-replication",
    ],
    design: [
      "assignment-and-observation",
      "fit-is-design",
      "selected-features-cause",
    ],
  },
});

/**
 * Blank, malformed, and expanded current records are removed on restore.
 * A fresh visit and a learner reset leave no replacement storage record.
 */
const module30ProgressLifecycle = createPredictionProgressLifecycle({
  storageKey: MODULE30_PROGRESS_STORAGE_KEY,
  codec: module30ProgressCodec,
});

export function restoreModule30Progress(storage) {
  return module30ProgressLifecycle.restore(storage);
}

export function persistModule30Progress(storage, record) {
  return module30ProgressLifecycle.persist(storage, record);
}

export function clearModule30Progress(storage) {
  return module30ProgressLifecycle.clear(storage);
}
