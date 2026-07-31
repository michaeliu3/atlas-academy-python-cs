/**
 * The sole browser seam for Atlas learner-progress storage. The returned
 * adapter deliberately has the narrow Storage-like interface that progress
 * codecs need; it does not expose enumeration, identity, or unrelated
 * browser-storage operations. Privacy-restricted browsers degrade to
 * in-memory learning instead of surfacing a storage exception to a studio.
 *
 * Browser progress is optional, local, and untrusted. It must never be used
 * for authorization, learner identity, mastery, release status, or Notion
 * evidence.
 *
 * @returns {{
 *   getItem: (key: string) => string | null,
 *   setItem: (key: string, value: string) => boolean,
 *   removeItem: (key: string) => boolean,
 * } | null}
 */
export function getBrowserProgressStorage() {
  if (typeof window === "undefined") return null;

  try {
    const browserStorage = window.localStorage;
    if (!browserStorage) return null;

    // A read probe distinguishes an inaccessible storage object from an empty
    // one. It does not create, enumerate, or retain a browser-storage key.
    browserStorage.getItem("atlas-academy.browser-progress-probe.v1");

    return Object.freeze({
      getItem(key) {
        try {
          return browserStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem(key, value) {
        try {
          browserStorage.setItem(key, value);
          return true;
        } catch {
          // A false result lets a migration keep its older record rather than
          // mistaking a blocked write for a durable replacement.
          return false;
        }
      },
      removeItem(key) {
        try {
          browserStorage.removeItem(key);
          return true;
        } catch {
          // Clearing is best effort when the browser denies storage access.
          return false;
        }
      },
    });
  } catch {
    return null;
  }
}
