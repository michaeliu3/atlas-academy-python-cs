import assert from "node:assert/strict";
import test from "node:test";

import {
  MODULE23_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE23_PROGRESS_STORAGE_KEY,
  module23ProgressCodec,
  parseModule23LegacyProgress,
} from "../lib/module23-progress-codec.js";

const completeRecord = {
  boundary: { choice: "syntax", confidence: 4, revealed: true },
  grammar: { choice: "multiply", confidence: 3, revealed: true },
  environment: { choice: "captured", confidence: 2, revealed: false },
  semantics: { choice: "selected", confidence: 1, revealed: false },
  contract: { choice: "named", confidence: 2, revealed: false },
  bridge: { choice: "observation", confidence: 3, revealed: false },
};

test("M23 restores only exact versioned prediction evidence and names separate migration keys", () => {
  assert.equal(
    MODULE23_PROGRESS_STORAGE_KEY,
    "atlas-academy.module23-language-lab.v2",
  );
  assert.equal(
    MODULE23_LEGACY_PROGRESS_STORAGE_KEY,
    "atlas-academy.module23-language-lab.v1",
  );

  const encoded = module23ProgressCodec.serialize(completeRecord);
  assert.deepEqual(JSON.parse(encoded), { version: 2, record: completeRecord });
  assert.deepEqual(module23ProgressCodec.parse(encoded), completeRecord);
  assert.equal(module23ProgressCodec.parse(JSON.stringify(completeRecord)), null);
  assert.deepEqual(
    parseModule23LegacyProgress(JSON.stringify(completeRecord)),
    completeRecord,
  );
});

test("M23 rejects forged current records and migrates only an exact legacy record", () => {
  const expandedCurrentRecord = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      boundary: { ...completeRecord.boundary, unexpected: "retain me" },
    },
  });
  const staleCurrentRecord = JSON.stringify({ version: 1, record: completeRecord });
  const typeConfusedCurrentRecord = JSON.stringify({
    version: 2,
    record: {
      ...completeRecord,
      boundary: { choice: ["syntax"], confidence: 4, revealed: true },
    },
  });
  const forgedLegacyReveal = JSON.stringify({
    ...completeRecord,
    contract: { choice: null, confidence: null, revealed: true },
  });
  const expandedLegacyRecord = JSON.stringify({
    ...completeRecord,
    bypass: { choice: "anything", confidence: 4, revealed: true },
  });
  const unknownLegacyChoice = JSON.stringify({
    ...completeRecord,
    grammar: { choice: "invented", confidence: 3, revealed: true },
  });

  assert.equal(module23ProgressCodec.parse(expandedCurrentRecord), null);
  assert.equal(module23ProgressCodec.parse(staleCurrentRecord), null);
  assert.equal(module23ProgressCodec.parse(typeConfusedCurrentRecord), null);
  assert.equal(parseModule23LegacyProgress(forgedLegacyReveal), null);
  assert.equal(parseModule23LegacyProgress(expandedLegacyRecord), null);
  assert.equal(parseModule23LegacyProgress(unknownLegacyChoice), null);
});
