import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const registryPath = resolve(
  siteRoot,
  "content",
  "course",
  "contracts",
  "module-contract-registry.v3.json",
);

const registry = JSON.parse(await readFile(registryPath, "utf8"));
for (const moduleEntry of registry.modules ?? []) {
  if (!("evidenceRecord" in moduleEntry)) moduleEntry.evidenceRecord = null;
  if (!("reviewRecord" in moduleEntry)) moduleEntry.reviewRecord = null;
}
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
console.log(`Added explicit promotion-record placeholders to ${registry.modules?.length ?? 0} v3 module entries.`);
