import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relativePath) =>
  JSON.parse(await readFile(resolve(siteRoot, relativePath), "utf8"));

test("M26 preview contract keeps its reference model out of the public download surface", async () => {
  const [packet, graph, policy, studio] = await Promise.all([
    readJson("content/course/contracts/m26-preview-contract-packet.v1.json"),
    readJson("content/course/course-graph.v2.json"),
    readJson("content/course/release-input-policy.v1.json"),
    readFile(resolve(siteRoot, "app/CapstoneDefenseStudio.tsx"), "utf8"),
  ]);
  const module26 = graph.modules.find(({ id }) => id === "m26");
  assert.equal(module26?.state.availability, "preview");
  assert.equal(module26?.state.readerAccess, "preview");
  assert.equal(packet.moduleId, "m26");
  assert.equal(packet.canonicalExpectation.availability, "preview");
  assert.deepEqual(packet.publicSurface.publicDownloadPaths, []);
  assert.ok(packet.privateReferenceInputs.length >= 2);
  for (const input of packet.privateReferenceInputs) {
    assert.ok(!input.path.startsWith("public/"));
    await access(resolve(siteRoot, input.path));
  }
  assert.ok(
    !policy.allowlistedDownloadPaths.some((path) => path.includes("module26")),
    "M26 reference inputs must not be allowlisted as public downloads",
  );
  assert.doesNotMatch(studio, /\/downloads\/module26_(?:reference|test)/u);
});
