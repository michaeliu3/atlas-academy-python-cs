import assert from "node:assert/strict";
import test from "node:test";

import {
  module24ProgressCodec,
  parseModule24LegacyProgress,
} from "../lib/module24-progress-codec.js";

const completeRecord = {
  contract: { choice: "semantic", confidence: 4, revealed: true },
  graph: { choice: "audit", confidence: 3, revealed: true },
  cycle: { choice: "model", confidence: 2, revealed: false },
  lens: { choice: "traced", confidence: 1, revealed: false },
  runtime: { choice: "pinned", confidence: 2, revealed: false },
  decision: { choice: "defer", confidence: 3, revealed: false },
};

test("M24 restores only its exact v2 envelope of prediction evidence", () => {
  const encoded = module24ProgressCodec.serialize(completeRecord);

  assert.deepEqual(JSON.parse(encoded), { version: 2, record: completeRecord });
  assert.deepEqual(module24ProgressCodec.parse(encoded), completeRecord);
});

test("M24 rejects untrusted v2 progress that expands, confuses, or bypasses the prediction gate", () => {
  const bareRecord = JSON.stringify(completeRecord);
  const extraView = JSON.stringify({
    version: 2,
    record: { ...completeRecord, bypass: { choice: "invented", confidence: 4, revealed: true } },
  });
  const extraEntryField = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      contract: { ...completeRecord.contract, retain: true },
    },
  });
  const typeConfusedChoice = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      contract: { choice: ["semantic"], confidence: 4, revealed: true },
    },
  });
  const forgedReveal = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      decision: { choice: null, confidence: null, revealed: true },
    },
  });

  assert.equal(module24ProgressCodec.parse(bareRecord), null);
  assert.equal(module24ProgressCodec.parse(extraView), null);
  assert.equal(module24ProgressCodec.parse(extraEntryField), null);
  assert.equal(module24ProgressCodec.parse(typeConfusedChoice), null);
  assert.equal(module24ProgressCodec.parse(forgedReveal), null);
});

test("M24 migrates only an exact legacy record and refuses malformed legacy state", () => {
  assert.deepEqual(
    parseModule24LegacyProgress(JSON.stringify(completeRecord)),
    completeRecord,
  );
  assert.equal(
    parseModule24LegacyProgress(
      JSON.stringify({
        ...completeRecord,
        runtime: { ...completeRecord.runtime, unexpected: "persist me" },
      }),
    ),
    null,
  );
  assert.equal(
    parseModule24LegacyProgress(
      JSON.stringify({
        ...completeRecord,
        decision: { choice: null, confidence: null, revealed: true },
      }),
    ),
    null,
  );
});
