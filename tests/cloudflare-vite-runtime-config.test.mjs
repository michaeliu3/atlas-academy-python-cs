import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps node compatibility owned by the canonical Wrangler configuration", async () => {
  const [viteConfig, wranglerConfig] = await Promise.all([
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
  ]);
  const localBindingConfig = viteConfig.match(
    /const localBindingConfig = \{([\s\S]*?)\n\};/u,
  );

  assert.ok(localBindingConfig, "Vite must retain its bounded local binding configuration");
  assert.match(wranglerConfig, /"compatibility_flags": \["nodejs_compat"\]/u);
  assert.doesNotMatch(localBindingConfig[1], /\bcompatibility_flags\b/u);
});
