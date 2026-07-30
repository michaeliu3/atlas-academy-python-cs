import assert from "node:assert/strict";
import test from "node:test";

import { createPredictionProgressCodec } from "../lib/local-progress-codec.js";

const codec = createPredictionProgressCodec({
  version: 1,
  viewIds: ["scope", "proof"],
  choiceIdsByView: {
    scope: ["forall-exists", "exists-forall"],
    proof: ["base", "samples"],
  },
});

const completeRecord = {
  scope: { choice: "forall-exists", confidence: 3, revealed: true },
  proof: { choice: "base", confidence: 1, revealed: false },
};

test("the local progress codec round-trips only a versioned allowlisted prediction record", () => {
  const encoded = codec.serialize(completeRecord);

  assert.deepEqual(JSON.parse(encoded), {
    version: 1,
    record: completeRecord,
  });
  assert.deepEqual(codec.parse(encoded), completeRecord);
});

test("the local progress codec rejects a forged reveal without a recorded prediction and confidence", () => {
  const forged = JSON.stringify({
    version: 1,
    record: {
      scope: { choice: null, confidence: null, revealed: true },
      proof: { choice: "base", confidence: 1, revealed: false },
    },
  });

  assert.equal(codec.parse(forged), null);
});

test("the local progress codec rejects unknown choices, unknown views, and a stale version", () => {
  const unknownChoice = JSON.stringify({
    version: 1,
    record: {
      scope: { choice: "invented-answer", confidence: 2, revealed: true },
      proof: { choice: "base", confidence: 1, revealed: false },
    },
  });
  const unknownView = JSON.stringify({
    version: 1,
    record: { ...completeRecord, bypass: { choice: "anything", confidence: 4, revealed: true } },
  });
  const staleVersion = JSON.stringify({ version: 0, record: completeRecord });

  assert.equal(codec.parse(unknownChoice), null);
  assert.equal(codec.parse(unknownView), null);
  assert.equal(codec.parse(staleVersion), null);
});

test("the local progress codec validates a single reveal checkpoint for a composite studio", () => {
  assert.deepEqual(
    codec.parseEntry("scope", {
      choice: "forall-exists",
      confidence: 4,
      revealed: true,
    }),
    { choice: "forall-exists", confidence: 4, revealed: true },
  );
  assert.equal(
    codec.parseEntry("scope", {
      choice: "invented-answer",
      confidence: 4,
      revealed: true,
    }),
    null,
  );
});
