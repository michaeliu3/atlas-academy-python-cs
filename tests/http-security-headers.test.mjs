import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { withSecurityHeaders } from "../lib/http-security-headers.js";

test("response security headers are applied without changing a response body", async () => {
  const request = new Request("https://atlas.example/modules/01-values-state-execution");
  const response = withSecurityHeaders(
    request,
    new Response("study", { headers: { "content-type": "text/plain" } }),
  );

  assert.equal(await response.text(), "study");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/u);
  assert.equal(
    response.headers.get("strict-transport-security"),
    "max-age=31536000",
  );
});

test("response security headers do not set HSTS for a local HTTP request", () => {
  const response = withSecurityHeaders(
    new Request("http://localhost/modules"),
    new Response("study"),
  );

  assert.equal(response.headers.get("strict-transport-security"), null);
});

test("the production Worker wraps both response paths with the shared policy", async () => {
  const worker = await readFile(
    new URL("../worker/index.ts", import.meta.url),
    "utf8",
  );

  assert.match(worker, /import \{ withSecurityHeaders \} from "\.\.\/lib\/http-security-headers";/u);
  assert.match(
    worker,
    /return withSecurityHeaders\(request, response\);/u,
    "image optimization responses retain the production boundary",
  );
  assert.match(
    worker,
    /return withSecurityHeaders\(request, await handler\.fetch\(request, env, ctx\)\);/u,
    "ordinary application responses retain the production boundary",
  );
  assert.doesNotMatch(
    worker,
    /return\s+handler\.fetch\(request, env, ctx\);/u,
    "the ordinary route must not bypass the shared policy",
  );
});
