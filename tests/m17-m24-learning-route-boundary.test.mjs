import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function workbook(filename) {
  return readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");
}

test("Arc IV names chats as guided learning and preserves its lean source routes", async () => {
  const [m18, m19, m20, m23, m24] = await Promise.all([
    workbook("18_operating_systems_resource_mediation.md"),
    workbook("19_concurrency_parallelism.md"),
    workbook("20_networks_application_protocols.md"),
    workbook("23_programming_languages_interpreters.md"),
    workbook("24_cpython_performance_memory.md"),
  ]);

  for (const markdown of [m18, m19, m20]) {
    assert.match(markdown, /designated Teaching Assistant and Study Partner\s+chats/u);
    assert.match(markdown, /visual\/reference companion/u);
  }
  assert.doesNotMatch(m18, /primary study surface/i);
  assert.doesNotMatch(m19, /primary learning surface|primary learning experience/i);
  assert.doesNotMatch(m20, /primary learning surface/i);

  assert.match(m23, /Stanford CS242 coursework/u);
  assert.match(m23, /link-only theory\/semantics route/u);
  assert.match(
    m24,
    /github\.com\/michaeliu3\/atlas-academy-python-cs\/blob\/main\/content\/source-maps\/module24_cpython_performance_memory_source_map\.md/u,
  );
});
