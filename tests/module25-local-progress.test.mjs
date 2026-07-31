import assert from "node:assert/strict";
import test from "node:test";

import { module25ProgressCodec } from "../lib/module25-progress-codec.js";

const completeRecord = {
  purpose: { choice: "optional", confidence: 4, revealed: true },
  lineage: { choice: "before", confidence: 3, revealed: true },
  ranking: { choice: "set", confidence: 2, revealed: false },
  evaluation: { choice: "bounded", confidence: 1, revealed: false },
  control: { choice: "person", confidence: 2, revealed: false },
  agent: { choice: "proposal", confidence: 3, revealed: false },
};

test("M25 restores only its exact versioned prediction evidence", () => {
  const encoded = module25ProgressCodec.serialize(completeRecord);

  assert.deepEqual(JSON.parse(encoded), {
    version: 2,
    record: completeRecord,
  });
  assert.deepEqual(module25ProgressCodec.parse(encoded), completeRecord);
});

test("M25 discards legacy, expanded, and type-confused browser records", () => {
  const legacyRawRecord = JSON.stringify(completeRecord);
  const expandedEntry = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      purpose: { ...completeRecord.purpose, unexpected: "retain me" },
    },
  });
  const typeConfusedChoice = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      purpose: { choice: ["optional"], confidence: 4, revealed: true },
    },
  });
  const expandedRoot = JSON.stringify({
    version: 2,
    record: completeRecord,
    bypass: true,
  });

  assert.equal(module25ProgressCodec.parse(legacyRawRecord), null);
  assert.equal(module25ProgressCodec.parse(expandedEntry), null);
  assert.equal(module25ProgressCodec.parse(typeConfusedChoice), null);
  assert.equal(module25ProgressCodec.parse(expandedRoot), null);
});

test("M25 does not restore a forged reveal without a selected prediction and confidence", () => {
  const forgedReveal = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      agent: { choice: null, confidence: null, revealed: true },
    },
  });

  assert.equal(module25ProgressCodec.parse(forgedReveal), null);
});
