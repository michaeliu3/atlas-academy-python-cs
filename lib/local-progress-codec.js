/**
 * The persisted envelope version for bounded local learner progress. This is
 * intentionally independent from a studio's storage-key suffix: the envelope
 * is the contract that lets a studio reject stale or hand-edited records.
 */
export const LOCAL_PROGRESS_CODEC_VERSION = 1;

const entryKeys = new Set(["choice", "confidence", "revealed"]);
const envelopeKeys = new Set(["version", "record"]);

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function hasExactlyKeys(value, expectedKeys) {
  return (
    Object.keys(value).length === expectedKeys.size &&
    Object.keys(value).every((key) => expectedKeys.has(key))
  );
}

/**
 * Create a codec for a studio whose only persisted learner evidence is one
 * selected prediction, one confidence level, and whether that evidence has
 * been revealed. Callers receive a small interface: `parse` fails closed and
 * `serialize` writes the same bounded envelope.
 *
 * @param {{
 *   version?: number,
 *   viewIds: readonly string[],
 *   choiceIdsByView: Record<string, readonly string[]>,
 *   confidenceLevels?: readonly number[],
 * }} definition
 */
export function createPredictionProgressCodec(definition) {
  const version = definition.version ?? LOCAL_PROGRESS_CODEC_VERSION;
  if (!Number.isInteger(version) || version < 1) {
    throw new TypeError("A local progress codec needs a positive integer version.");
  }

  const viewIds = [...definition.viewIds];
  const viewIdsSet = new Set(viewIds);
  if (viewIds.length === 0 || viewIdsSet.size !== viewIds.length) {
    throw new TypeError("A local progress codec needs unique view IDs.");
  }

  const choiceIdsByView = new Map();
  for (const viewId of viewIds) {
    const choiceIds = definition.choiceIdsByView[viewId];
    if (!Array.isArray(choiceIds) || choiceIds.length === 0) {
      throw new TypeError(`Local progress view ${viewId} needs allowlisted choices.`);
    }
    const choiceSet = new Set(choiceIds);
    if (choiceSet.size !== choiceIds.length || choiceIds.some((choice) => typeof choice !== "string")) {
      throw new TypeError(`Local progress view ${viewId} has invalid choice IDs.`);
    }
    choiceIdsByView.set(viewId, choiceSet);
  }

  const confidenceLevels = new Set(
    definition.confidenceLevels ?? [1, 2, 3, 4],
  );
  if (
    confidenceLevels.size === 0 ||
    [...confidenceLevels].some((level) => !Number.isInteger(level))
  ) {
    throw new TypeError("Local progress confidence levels must be integers.");
  }

  /** @param {string} viewId @param {unknown} candidate */
  function parseEntry(viewId, candidate) {
    if (
      !viewIdsSet.has(viewId) ||
      !isPlainRecord(candidate) ||
      !hasExactlyKeys(candidate, entryKeys)
    ) {
      return null;
    }

    const choice = candidate.choice;
    const confidence = candidate.confidence;
    const revealed = candidate.revealed;
    if (
      choice !== null &&
      (typeof choice !== "string" || !choiceIdsByView.get(viewId)?.has(choice))
    ) {
      return null;
    }
    if (confidence !== null && !confidenceLevels.has(confidence)) {
      return null;
    }
    if (typeof revealed !== "boolean") {
      return null;
    }
    if (revealed && (choice === null || confidence === null)) {
      return null;
    }

    return { choice, confidence, revealed };
  }

  /** @param {unknown} candidate */
  function parseRecord(candidate) {
    if (!isPlainRecord(candidate) || !hasExactlyKeys(candidate, viewIdsSet)) {
      return null;
    }

    const record = {};
    for (const viewId of viewIds) {
      const entry = parseEntry(viewId, candidate[viewId]);
      if (!entry) return null;
      record[viewId] = entry;
    }
    return record;
  }

  /** @param {unknown} raw */
  function parse(raw) {
    if (typeof raw !== "string") return null;
    try {
      const envelope = JSON.parse(raw);
      if (
        !isPlainRecord(envelope) ||
        !hasExactlyKeys(envelope, envelopeKeys) ||
        envelope.version !== version
      ) {
        return null;
      }
      return parseRecord(envelope.record);
    } catch {
      return null;
    }
  }

  /** @param {unknown} record */
  function serialize(record) {
    const parsed = parseRecord(record);
    if (!parsed) {
      throw new TypeError("Cannot persist local progress outside the declared codec contract.");
    }
    return JSON.stringify({ version, record: parsed });
  }

  return Object.freeze({
    version,
    parse,
    parseEntry,
    serialize,
    isRecord: (value) => parseRecord(value) !== null,
  });
}
