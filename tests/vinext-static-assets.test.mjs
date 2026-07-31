import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { StaticFileCache } from "../node_modules/vinext/dist/server/static-file-cache.js";

test("the Vinext production static-file cache resolves browser URL separators", async () => {
  const clientRoot = await mkdtemp(join(tmpdir(), "atlas-vinext-static-"));
  try {
    await mkdir(join(clientRoot, "assets"));
    await writeFile(join(clientRoot, "assets", "browser-entry.js"), "export {};\n");

    const cache = await StaticFileCache.create(clientRoot);
    assert.ok(
      cache.lookup("/assets/browser-entry.js"),
      "browser-style forward-slash URLs must resolve to the generated static asset",
    );
  } finally {
    await rm(clientRoot, { recursive: true, force: true });
  }
});
