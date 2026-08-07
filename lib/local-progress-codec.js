/**
 * The persisted envelope version for bounded local learner progress. This is
 * intentionally independent from a studio's storage-key suffix: the envelope
 * is a structural contract that lets a studio reject stale, malformed, or
 * unallowlisted records. It cannot prove who made a syntactically valid local
 * record, when it was made, or whether it demonstrates mastery.
 */
export const LOCAL_PROGRESS_CODEC_VERSION = 1;

const entryKeys = new Set(["choice", "confidence", "revealed"]);
const envelopeKeys = new Set(["version", "record"]);

export function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

export function hasExactlyKeys(value, expectedKeys) {
  return (
    Object.keys(value).length === expectedKeys.size &&
    Object.keys(value).every((key) => expectedKeys.has(key))
  );
}

/**
 * Native Web Storage mutation methods return `undefined` on success. The
 * Atlas browser adapter instead returns `false` when it caught an operation
 * failure. Treating only that explicit signal as failure keeps codec tests
 * compatible with normal Storage-shaped adapters while preserving a legacy
 * record when its replacement could not be written.
 *
 * @param {unknown} result
 */
export function storageOperationSucceeded(result) {
  return result !== false;
}

/**
 * Create the shared, versioned envelope used when a learning surface needs a
 * bounded record richer than independent prediction triads. The caller's
 * normalizer is the allowlist: it must return a fresh, normalized plain record
 * or `null`. Parsing fails closed for malformed envelopes and serialization
 * refuses anything outside that allowlist.
 *
 * @param {{
 *   version?: number,
 *   normalizeRecord: (candidate: unknown) => Record<string, unknown> | null,
 * }} definition
 */
export function createVersionedProgressCodec(definition) {
  const version = definition.version ?? LOCAL_PROGRESS_CODEC_VERSION;
  if (!Number.isInteger(version) || version < 1) {
    throw new TypeError("A local progress codec needs a positive integer version.");
  }
  if (typeof definition.normalizeRecord !== "function") {
    throw new TypeError("A local progress codec needs a record normalizer.");
  }

  /** @param {unknown} candidate */
  function normalizeRecord(candidate) {
    try {
      const normalized = definition.normalizeRecord(candidate);
      return isPlainRecord(normalized) ? normalized : null;
    } catch {
      return null;
    }
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
      return normalizeRecord(envelope.record);
    } catch {
      return null;
    }
  }

  /** @param {unknown} record */
  function serialize(record) {
    const normalized = normalizeRecord(record);
    if (!normalized) {
      throw new TypeError("Cannot persist local progress outside the declared codec contract.");
    }
    return JSON.stringify({ version, record: normalized });
  }

  return Object.freeze({
    version,
    parse,
    serialize,
    isRecord: (value) => normalizeRecord(value) !== null,
  });
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
 *   confidenceLevels?: readonly (number | string)[],
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
    [...confidenceLevels].some(
      (level) =>
        !(
          (typeof level === "string" && level.length > 0) ||
          Number.isInteger(level)
        ),
    )
  ) {
    throw new TypeError(
      "Local progress confidence levels must be non-empty strings or integers.",
    );
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

/**
 * Put the lifecycle rules for a prediction-only browser record behind one
 * small interface. A studio supplies an exact codec and its declared current
 * and retired keys; this module then owns the privacy-sensitive decisions:
 * blank or malformed current data is removed, retired data never revives, and
 * a fresh page or reset never creates an empty replacement envelope.
 *
 * Storage is deliberately injected. Browser code obtains the safe adapter at
 * the browser-progress seam, while tests can exercise this contract with a
 * tiny in-memory adapter.
 *
 * @param {{
 *   storageKey: string,
 *   codec: {
 *     parse: (raw: unknown) => Record<string, { choice: unknown, confidence: unknown, revealed: boolean }> | null,
 *     serialize: (record: unknown) => string,
 *     isRecord: (record: unknown) => boolean,
 *   },
 *   retiredStorageKeys?: readonly string[],
 * }} definition
 */
export function createPredictionProgressLifecycle(definition) {
  const storageKey = definition?.storageKey;
  const codec = definition?.codec;
  if (typeof storageKey !== "string" || storageKey.length === 0) {
    throw new TypeError("A prediction progress lifecycle needs a current storage key.");
  }
  if (
    !codec ||
    typeof codec.parse !== "function" ||
    typeof codec.serialize !== "function" ||
    typeof codec.isRecord !== "function"
  ) {
    throw new TypeError("A prediction progress lifecycle needs a prediction codec.");
  }

  const retiredStorageKeys = [...(definition.retiredStorageKeys ?? [])];
  if (
    retiredStorageKeys.some((key) => typeof key !== "string" || key.length === 0) ||
    new Set(retiredStorageKeys).size !== retiredStorageKeys.length ||
    retiredStorageKeys.includes(storageKey)
  ) {
    throw new TypeError("Retired prediction storage keys must be unique and distinct.");
  }

  /** @param {unknown} record */
  function hasMeaningfulProgress(record) {
    return (
      codec.isRecord(record) &&
      Object.values(record).some(
        (entry) =>
          entry.choice !== null ||
          entry.confidence !== null ||
          entry.revealed,
      )
    );
  }

  /** @param {{ removeItem: (key: string) => boolean | void }} storage */
  function clear(storage) {
    let succeeded = storageOperationSucceeded(storage.removeItem(storageKey));
    for (const retiredStorageKey of retiredStorageKeys) {
      succeeded = storageOperationSucceeded(storage.removeItem(retiredStorageKey)) && succeeded;
    }
    return succeeded;
  }

  /** @param {{ getItem: (key: string) => string | null, removeItem: (key: string) => boolean | void }} storage */
  function restore(storage) {
    const rawCurrent = storage.getItem(storageKey);
    const currentRecord = codec.parse(rawCurrent);
    if (rawCurrent !== null && !hasMeaningfulProgress(currentRecord)) {
      storage.removeItem(storageKey);
    }
    for (const retiredStorageKey of retiredStorageKeys) {
      storage.removeItem(retiredStorageKey);
    }
    return hasMeaningfulProgress(currentRecord) ? currentRecord : null;
  }

  /** @param {{ setItem: (key: string, value: string) => boolean | void, removeItem: (key: string) => boolean | void }} storage @param {unknown} record */
  function persist(storage, record) {
    if (!hasMeaningfulProgress(record)) {
      clear(storage);
      return false;
    }
    if (!storageOperationSucceeded(storage.setItem(storageKey, codec.serialize(record)))) {
      return false;
    }
    for (const retiredStorageKey of retiredStorageKeys) {
      storage.removeItem(retiredStorageKey);
    }
    return true;
  }

  return Object.freeze({
    storageKey,
    retiredStorageKeys: Object.freeze(retiredStorageKeys),
    hasMeaningfulProgress,
    restore,
    persist,
    clear,
  });
}
