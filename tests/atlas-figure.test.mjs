import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildAtlasFigure } from "../lib/atlas-figure.mjs";
import {
  mermaidAccessibilityMetadataErrors,
  scanMermaidBlocks,
} from "../lib/mermaid-accessibility.mjs";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function build(spec) {
  return buildAtlasFigure(JSON.stringify(spec));
}

test("a malformed spec fails with a readable reason instead of throwing", () => {
  assert.equal(buildAtlasFigure("{").ok, false);
  assert.match(buildAtlasFigure("{").error, /not valid JSON/u);
  assert.match(build({ kind: "spiral" }).error, /unknown figure kind/u);
  assert.match(build({ kind: "plot", series: [] }).error, /at least one series/u);
  assert.match(build({ kind: "plot", series: [{ points: [[0, 0]] }] }).error, /at least two points/u);
  assert.match(build({ kind: "vector2d" }).error, /at least one vector/u);
  assert.match(
    build({ kind: "vector2d", vectors: [{ to: [1, 1] }], rightAngles: [{ at: [0, 0] }] }).error,
    /toward must be two points/u,
  );
  assert.match(build({ kind: "plot", series: [{ points: [[0, 0], [1, "x"]] }] }).error, /finite number/u);
});

test("user coordinates map into the view box with y inverted", () => {
  const built = build({
    kind: "plot",
    xRange: [0, 10],
    yRange: [0, 10],
    width: 200,
    height: 200,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    series: [{ points: [[0, 0], [10, 10]] }],
  });
  assert.equal(built.ok, true);

  const polyline = built.figure.scene.find((item) => item.t === "polyline");
  // (0,0) sits at the bottom-left of the plot area and (10,10) at the top-right.
  assert.equal(polyline.points, "0,200 200,0");
});

test("a vector figure emits an arrowhead and a right-angle mark", () => {
  const built = build({
    kind: "vector2d",
    xRange: [-1, 4],
    yRange: [-1, 4],
    vectors: [{ to: [1, 3], label: "b" }],
    segments: [{ from: [1.8, 0.6], to: [1, 3], style: "dashed" }],
    rightAngles: [{ at: [1.8, 0.6], toward: [[1, 3], [3.9, 1.3]] }],
  });
  assert.equal(built.ok, true);

  const kinds = built.figure.scene.map((item) => item.t);
  assert.ok(kinds.includes("polygon"), "the vector needs an arrowhead");
  assert.ok(
    built.figure.scene.some((item) => item.cls?.includes("right-angle")),
    "the projection mark is the point of the figure",
  );
  assert.ok(
    built.figure.scene.some((item) => item.cls?.includes("dashed")),
    "a dashed segment must keep its style",
  );
  // Labels travel as data, never as markup.
  const label = built.figure.scene.find((item) => item.t === "text" && item.text === "b");
  assert.ok(label, "the vector label must reach the scene");
});

test("bars accept negative values and keep a visible baseline", () => {
  const built = build({
    kind: "bars",
    bars: [{ label: "up", value: 4 }, { label: "down", value: -2 }],
  });
  assert.equal(built.ok, true);
  const rects = built.figure.scene.filter((item) => item.t === "rect");
  assert.equal(rects.length, 2);
  for (const rect of rects) {
    assert.ok(rect.height > 0, "a bar must have positive height whichever way it points");
  }
});

test("every authored figure in the corpus builds and carries a text alternative", async () => {
  const directories = ["content/modules", "content/authoring"];
  let figures = 0;

  for (const directory of directories) {
    const absolute = resolve(siteRoot, directory);
    const files = (await readdir(absolute)).filter((name) => name.endsWith(".md"));
    for (const name of files) {
      const markdown = await readFile(resolve(absolute, name), "utf8");
      for (const block of scanMermaidBlocks(markdown, { language: "atlas-figure" })) {
        figures += 1;
        assert.deepEqual(
          mermaidAccessibilityMetadataErrors(block),
          [],
          `${directory}/${name}:${block.line} figure needs complete id/title/alternative metadata`,
        );
        const built = buildAtlasFigure(block.renderSource);
        assert.equal(
          built.ok,
          true,
          `${directory}/${name}:${block.line} figure spec failed: ${built.ok ? "" : built.error}`,
        );
      }
    }
  }

  assert.ok(figures > 0, "the corpus should carry authored figures");
});
