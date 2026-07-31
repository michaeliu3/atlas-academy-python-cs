import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  validateClientPerformanceBudget,
} from "../scripts/validate-client-performance-budget.mjs";

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const validatorPath = resolve(
  siteRoot,
  "scripts",
  "validate-client-performance-budget.mjs",
);
const courseGraphPath = resolve(siteRoot, "content", "course", "course-graph.v2.json");
const policyPath = resolve(
  siteRoot,
  "content",
  "course",
  "client-performance-budget.v1.json",
);

const fixturePolicy = {
  schemaVersion: 1,
  policyVersion: "fixture-v1",
  description: "A small, independent manifest fixture for the CLI performance-budget seam.",
  measurement: {
    unit: "raw emitted bytes",
    includes: ["fixture asset files", "fixture manifest import boundaries"],
    doesNotMeasure: ["fixture network timing"],
  },
  output: {
    clientDirectory: "dist/client",
    assetDirectory: "assets",
    manifestPath: ".vite/manifest.json",
  },
  limits: {
    maxClientAssetBytes: 320,
    maxClientAssetCount: 3,
    maxSingleAssetBytes: 200,
    initialEntry: {
      manifestKey: "virtual:fixture-browser-entry",
      maxStaticClosureBytes: 160,
    },
    studios: {
      maxOwnEntryBytes: 120,
      maxStaticClosureBytes: 220,
      entries: [
        {
          studioId: "fixture-studio",
          manifestName: "FixtureStudio",
        },
      ],
    },
  },
};

async function writeBytes(path, byteLength) {
  await writeFile(path, Buffer.alloc(byteLength, 0));
}

async function makeFixture({ studioByteLength = 100, staticallyImportedStudio = false } = {}) {
  const root = await mkdtemp(resolve(tmpdir(), "atlas-performance-budget-"));
  const clientRoot = resolve(root, "dist", "client");
  const assetsRoot = resolve(clientRoot, "assets");
  await mkdir(resolve(clientRoot, ".vite"), { recursive: true });
  await mkdir(assetsRoot, { recursive: true });
  await mkdir(resolve(root, "content", "course"), { recursive: true });

  const browserEntry = {
    file: "assets/entry.js",
    isEntry: true,
    imports: ["shared"],
    dynamicImports: staticallyImportedStudio ? [] : ["fixture-studio-entry"],
  };
  if (staticallyImportedStudio) {
    browserEntry.imports.push("fixture-studio-entry");
  }

  await writeFile(
    resolve(clientRoot, ".vite", "manifest.json"),
    `${JSON.stringify({
      "virtual:fixture-browser-entry": browserEntry,
      shared: { file: "assets/shared.js" },
      "fixture-studio-entry": {
        file: "assets/fixture-studio.js",
        name: "FixtureStudio",
        imports: ["shared"],
      },
    }, null, 2)}\n`,
  );
  await writeFile(
    resolve(root, "content", "course", "client-performance-budget.v1.json"),
    `${JSON.stringify(fixturePolicy, null, 2)}\n`,
  );
  await writeBytes(resolve(assetsRoot, "entry.js"), 100);
  await writeBytes(resolve(assetsRoot, "shared.js"), 50);
  await writeBytes(resolve(assetsRoot, "fixture-studio.js"), studioByteLength);
  return root;
}

test("the built client report records independent raw-byte limits and code-split studio evidence", async (t) => {
  const root = await makeFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  const report = await validateClientPerformanceBudget(root);

  assert.equal(report.assetMetrics.totalBytes, 250);
  assert.equal(report.assetMetrics.fileCount, 3);
  assert.equal(report.initialEntry.staticClosureBytes, 150);
  assert.deepEqual(report.studios, [
    {
      studioId: "fixture-studio",
      manifestName: "FixtureStudio",
      entryBytes: 100,
      staticClosureBytes: 150,
      codeSplitFromInitialEntry: true,
    },
  ]);
});

test("the versioned performance policy tracks every graph-declared studio", async () => {
  const [graphSource, policySource] = await Promise.all([
    readFile(courseGraphPath, "utf8"),
    readFile(policyPath, "utf8"),
  ]);
  const graph = JSON.parse(graphSource);
  const policy = JSON.parse(policySource);

  assert.deepEqual(
    policy.limits.studios.entries.map(({ studioId }) => studioId),
    graph.modules
      .map(({ studioId }) => studioId)
      .filter((studioId) => studioId !== null),
  );
});

test("the public CLI rejects a built studio entry that exceeds its reviewed byte budget", async (t) => {
  const root = await makeFixture({ studioByteLength: 121 });
  t.after(() => rm(root, { recursive: true, force: true }));

  await assert.rejects(
    execFileAsync(process.execPath, [validatorPath, "--root", root]),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /fixture-studio entry bytes 121 B exceed the 120 B limit/u);
      return true;
    },
  );
});

test("the public CLI rejects a studio that regresses into the initial static closure", async (t) => {
  const root = await makeFixture({ staticallyImportedStudio: true });
  t.after(() => rm(root, { recursive: true, force: true }));

  await assert.rejects(
    execFileAsync(process.execPath, [validatorPath, "--root", root]),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /fixture-studio must remain code-split from the initial browser entry/u);
      return true;
    },
  );
});
