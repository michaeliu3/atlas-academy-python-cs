import { createPredictionProgressCodec } from "./local-progress-codec.js";

/**
 * M25 keeps only the six prediction gates in browser storage.  The `v2` key
 * deliberately does not migrate the older un-enveloped record: browser state
 * is optional, untrusted, and never evidence of mastery.
 */
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
