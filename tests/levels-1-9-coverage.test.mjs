import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "../scripts/course-graph.mjs";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(siteRoot, relativePath), "utf8"));
}

/**
 * The reader manifest is the authority on what a learner can actually open,
 * so probes run against exactly those files rather than against everything in
 * content/modules (which also holds the hidden M31–M36 workbooks).
 */
async function readerVisibleMarkdown() {
  const { modules } = await readJson("content/modules/manifest.json");
  return Promise.all(
    modules.map(async (entry) => ({
      id: entry.id,
      markdown: await readFile(resolve(siteRoot, "content/modules", entry.filename), "utf8"),
    })),
  );
}

/**
 * Structural anchoring: does an atomic target's scope topic name at least one
 * module a learner can currently open? This is a graph property only. It is
 * deliberately reported next to the reviewed judgement, because the two
 * disagree sharply at Levels 6 to 9.
 */
function structuralAnchoredTargets(graph, crosswalk) {
  const visible = new Map(graph.modules.map((entry) => [entry.id, entry.state.readerAccess !== "hidden"]));
  const topicIsAnchoredVisibly = new Map(
    graph.scopeMatrix.topics.map((topic) => [
      topic.id,
      topic.anchors.some(({ moduleId }) => visible.get(moduleId)),
    ]),
  );

  const perLevel = new Map();
  for (const item of crosswalk.atomicItems) {
    const level = Number(item.sectionId.match(/^l(\d)/u)[1]);
    const anchored = item.scopeTopicIds.some((topicId) => topicIsAnchoredVisibly.get(topicId));
    const counts = perLevel.get(level) ?? { total: 0, anchored: 0 };
    counts.total += 1;
    if (anchored) counts.anchored += 1;
    perLevel.set(level, counts);
  }
  return perLevel;
}

test("the recorded structural coverage still matches the graph", async () => {
  const graph = await loadCourseGraph();
  const crosswalk = await readJson("content/course/levels-1-9-inventory-crosswalk.v1.json");
  const baseline = await readJson("content/course/levels-1-9-delivery-baseline.v1.json");

  const measured = structuralAnchoredTargets(graph, crosswalk);
  assert.equal(baseline.levels.length, 9, "every level needs a recorded baseline");

  for (const level of baseline.levels) {
    const counts = measured.get(level.level);
    assert.ok(counts, `level ${level.level} has no crosswalk targets`);
    assert.equal(
      counts.total,
      level.totalTargets,
      `level ${level.level} target count drifted; update the baseline deliberately`,
    );
    assert.equal(
      counts.anchored,
      level.structuralAnchoredTargets,
      `level ${level.level} structural coverage changed from ${level.structuralAnchoredTargets} to ${counts.anchored}. ` +
        "If a module was promoted or hidden, update levels-1-9-delivery-baseline.v1.json and re-review reviewedDelivery.",
    );
  }
});

test("every level recorded as undelivered really is absent from reader-visible material", async () => {
  const baseline = await readJson("content/course/levels-1-9-delivery-baseline.v1.json");
  const documents = await readerVisibleMarkdown();
  assert.ok(documents.length >= 30, "the reader route should expose the published modules");

  for (const level of baseline.levels) {
    for (const probe of level.absenceProbes) {
      const pattern = new RegExp(probe, "iu");
      const hits = documents.filter((document) => pattern.test(document.markdown)).map((document) => document.id);

      if (level.reviewedDelivery === "none") {
        assert.deepEqual(
          hits,
          [],
          `Level ${level.level} is recorded as undelivered, but ${JSON.stringify(probe)} now appears in ${hits.join(", ")}. ` +
            "Either the level is being taught now — update the baseline — or the term arrived without its teaching.",
        );
      }
    }
  }
});

test("a level cannot claim more reviewed delivery than it has structure for", async () => {
  const baseline = await readJson("content/course/levels-1-9-delivery-baseline.v1.json");
  for (const level of baseline.levels) {
    if (level.reviewedDelivery === "none") {
      assert.deepEqual(
        level.deliveredBy,
        [],
        `level ${level.level} says nothing is delivered but names delivering modules`,
      );
      assert.ok(
        level.absenceProbes.length > 0,
        `level ${level.level} claims nothing is delivered, so it must supply probes that make the claim checkable`,
      );
    }
    if (level.reviewedDelivery !== "none") {
      assert.ok(
        level.deliveredBy.length > 0,
        `level ${level.level} claims delivery but names no module`,
      );
    }
    assert.ok(
      typeof level.undeliveredBecause === "string" && level.undeliveredBecause.length > 40,
      `level ${level.level} needs a stated reason for its gap`,
    );
  }
});
