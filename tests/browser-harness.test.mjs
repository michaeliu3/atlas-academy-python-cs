import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the browser acceptance harness passes its requested port directly to Vinext", async () => {
  const config = await readFile(new URL("../playwright.config.ts", import.meta.url), "utf8");

  assert.match(config, /command:\s*"pnpm exec vinext start --port 4173"/u);
  assert.doesNotMatch(config, /pnpm start -- --port 4173/u);
});
