import assert from "node:assert/strict";
import test from "node:test";

import {
  benchDependencyAllowlist,
  benchIdFor,
  benchPackIds,
  benchPackRegistry,
  findBenchPack,
  ladderRungs,
  primaryRung,
  resolveModuleBench,
} from "../lib/module-bench-registry.mjs";

const readyModule = (overrides = {}) => ({
  benchPackId: null,
  state: { lifecycle: "learner-material-ready", readerAccess: "full", availability: "open" },
  ...overrides,
});

test("the ladder is the canonical eight rungs, in order", () => {
  assert.deepEqual(ladderRungs, [
    "recognize",
    "trace",
    "map",
    "modify",
    "debug-and-defend",
    "design-and-delegate",
    "review-and-verify",
    "transfer",
  ]);
});

test("a locked module resolves to unavailable before anything else is considered", () => {
  const resolution = resolveModuleBench(
    readyModule({ benchPackId: "m05", state: { availability: "locked" } }),
  );
  assert.equal(resolution.kind, "unavailable");
  assert.equal(resolution.state, "locked");
});

test("an authoring-only module never exposes a bench pack", () => {
  const resolution = resolveModuleBench(
    readyModule({
      benchPackId: "m05",
      state: { lifecycle: "learner-material-ready", readerAccess: "full", availability: "authoring-only" },
    }),
  );
  assert.equal(resolution.kind, "unavailable");
  assert.equal(resolution.state, "authoring-only");
});

test("a null declaration is workbook-only, not an error", () => {
  assert.equal(resolveModuleBench(readyModule()).kind, "workbook-only");
});

test("an unregistered id is a configuration error, never a guess", () => {
  const resolution = resolveModuleBench(readyModule({ benchPackId: "m99" }));
  assert.equal(resolution.kind, "configuration-error");
  assert.equal(resolution.benchPackId, "m99");
});

test("a registered id resolves to its pack", () => {
  const resolution = resolveModuleBench(readyModule({ benchPackId: "m05" }));
  assert.equal(resolution.kind, "bench-pack");
  assert.equal(resolution.registration.benchPackId, "m05");
});

test("findBenchPack rejects non-strings and unknown ids without throwing", () => {
  assert.equal(findBenchPack(undefined), null);
  assert.equal(findBenchPack(42), null);
  assert.equal(findBenchPack("nope"), null);
});

test("primaryRung is the first declared rung", () => {
  assert.equal(primaryRung({ rungs: ["modify", "trace"] }), "modify");
  assert.equal(primaryRung({ rungs: [] }), null);
  assert.equal(primaryRung(undefined), null);
});

test("benchIdFor composes the pack key", () => {
  assert.equal(benchIdFor("m05", 3), "m05-s3");
});

test("every registered pack is internally well-formed", () => {
  for (const benchPackId of benchPackIds) {
    const pack = benchPackRegistry[benchPackId];
    assert.equal(pack.benchPackId, benchPackId, `${benchPackId}: id mismatch`);

    const seen = new Set();
    for (const session of pack.sessions) {
      assert.ok(
        Number.isInteger(session.sessionNumber) &&
          session.sessionNumber >= 1 &&
          session.sessionNumber <= 6,
        `${benchPackId}: session number out of range`,
      );
      assert.ok(!seen.has(session.sessionNumber), `${benchPackId}: duplicate session`);
      seen.add(session.sessionNumber);

      assert.ok(session.emitsArtifact?.length, `${benchPackId}: empty emitsArtifact`);
      assert.match(session.sessionSha256 ?? "", /^[0-9a-f]{64}$/u, `${benchPackId}: bad hash`);

      for (const rung of session.rungs) {
        assert.ok(ladderRungs.includes(rung), `${benchPackId}: unknown rung ${rung}`);
      }
      for (const dependency of session.dependencies ?? []) {
        assert.ok(
          benchDependencyAllowlist.includes(dependency),
          `${benchPackId}: dependency ${dependency} outside allowlist`,
        );
      }
    }
  }
});

test("the session-slice regex matches both heading forms in the corpus", async () => {
  // Regression. An earlier pattern required "## Session N —" and silently found
  // ZERO sessions in M19–M30, which use "## 2. Session 1 —". Every bench in two
  // thirds of the corpus would have failed to hash, and the error message would
  // have blamed the workbook.
  const { createHash } = await import("node:crypto");
  const { readFile, readdir } = await import("node:fs/promises");
  const { dirname, join, resolve } = await import("node:path");
  const { fileURLToPath } = await import("node:url");

  const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const modulesDir = join(siteRoot, "content", "modules");
  const files = await readdir(modulesDir);

  const digestsFor = (text) => {
    const normalized = text.replace(/\r\n/gu, "\n");
    const allH2 = [...normalized.matchAll(/^##\s/gmu)].map((m) => m.index);
    const found = new Map();
    for (const match of normalized.matchAll(/^##\s+(?:\d+\.\s+)?Session\s+([1-6])\b/gmu)) {
      const end = allH2.find((index) => index > match.index) ?? normalized.length;
      found.set(
        Number(match[1]),
        createHash("sha256").update(normalized.slice(match.index, end)).digest("hex"),
      );
    }
    return found;
  };

  // Both heading forms, one module each.
  for (const prefix of ["05_", "19_"]) {
    const name = files.find((file) => file.startsWith(prefix) && file.endsWith(".md"));
    assert.ok(name, `no workbook found for ${prefix}`);
    const digests = digestsFor(await readFile(join(modulesDir, name), "utf8"));
    assert.equal(digests.size, 6, `${name}: expected six session slices, got ${digests.size}`);
    for (const digest of digests.values()) {
      assert.match(digest, /^[0-9a-f]{64}$/u);
    }
  }
});

test("every registered session hash still matches its workbook slice", async () => {
  const { createHash } = await import("node:crypto");
  const { readFile } = await import("node:fs/promises");
  const { dirname, join, resolve } = await import("node:path");
  const { fileURLToPath } = await import("node:url");

  const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const packs = JSON.parse(
    await readFile(join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"),
  );

  for (const benchPackId of benchPackIds) {
    const pack = benchPackRegistry[benchPackId];
    const moduleId = `m${String(pack.moduleNumber).padStart(2, "0")}`;
    const teaching = packs.modules.find((entry) => entry.moduleId === moduleId);
    const text = (await readFile(join(siteRoot, teaching.workbook.path), "utf8")).replace(
      /\r\n/gu,
      "\n",
    );
    const allH2 = [...text.matchAll(/^##\s/gmu)].map((m) => m.index);
    const slices = new Map();
    for (const match of text.matchAll(/^##\s+(?:\d+\.\s+)?Session\s+([1-6])\b/gmu)) {
      const end = allH2.find((index) => index > match.index) ?? text.length;
      slices.set(Number(match[1]), text.slice(match.index, end));
    }
    for (const session of pack.sessions) {
      const slice = slices.get(session.sessionNumber);
      assert.ok(slice, `${benchPackId}-s${session.sessionNumber}: no slice found`);
      assert.equal(
        createHash("sha256").update(slice).digest("hex"),
        session.sessionSha256,
        `${benchPackId}-s${session.sessionNumber}: session contract changed`,
      );
    }
  }
});

test("R1 and R2 hold for every complete pack", () => {
  for (const benchPackId of benchPackIds) {
    const pack = benchPackRegistry[benchPackId];
    const primaries = pack.sessions.map((session) => primaryRung(session));

    // R1 — implementation is 5% of the evidence weight.
    const modifyPrimary = primaries.filter((rung) => rung === "modify");
    assert.ok(modifyPrimary.length <= 1, `${benchPackId}: R1 — ${modifyPrimary.length} modify-primary benches`);
    for (const session of pack.sessions) {
      assert.ok(
        !(session.rungs.length === 1 && session.rungs[0] === "modify"),
        `${benchPackId}: R1 — a bench has modify as its only rung`,
      );
    }

    // R2 — the two heaviest rungs must be present once the pack is complete.
    if (pack.sessions.length === 6) {
      for (const required of ["debug-and-defend", "review-and-verify"]) {
        assert.ok(primaries.includes(required), `${benchPackId}: R2 — no ${required}-primary bench`);
      }
    }
  }
});
