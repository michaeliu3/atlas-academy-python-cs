import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";
import rehypeSanitize from "rehype-sanitize";
import {
  atlasMarkdownSanitizationSchema,
  atlasMermaidSvgSanitizationConfig,
  removeNonLocalMermaidReferences,
} from "../lib/rich-content-sanitization.mjs";
import { renderSafeMermaidSvg } from "../lib/render-safe-mermaid.mjs";
import { scanMermaidBlocks } from "../lib/mermaid-accessibility.mjs";

function element(tagName, properties = {}, children = []) {
  return { type: "element", tagName, properties, children };
}

function text(value) {
  return { type: "text", value };
}

function installMermaidDom() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.DOMParser = dom.window.DOMParser;
  globalThis.XMLSerializer = dom.window.XMLSerializer;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.SVGElement = dom.window.SVGElement;
  globalThis.Element = dom.window.Element;
  globalThis.Node = dom.window.Node;
  globalThis.getComputedStyle = dom.window.getComputedStyle;
  globalThis.CSSStyleSheet = class {
    constructor() {
      this.cssRules = [];
    }

    insertRule(rule) {
      this.cssRules.push({ cssText: rule });
      return this.cssRules.length - 1;
    }

    replaceSync() {}
  };
  if (!globalThis.SVGElement.prototype.getBBox) {
    globalThis.SVGElement.prototype.getBBox = () => ({
      height: 20,
      width: 100,
      x: 0,
      y: 0,
    });
  }
  if (!globalThis.SVGElement.prototype.getComputedTextLength) {
    globalThis.SVGElement.prototype.getComputedTextLength = () => 100;
  }
  return dom.window;
}

const renderedWindow = installMermaidDom();
const { default: dompurify } = await import("dompurify");

function purifierForRenderedWindow() {
  return typeof dompurify.sanitize === "function" ? dompurify : dompurify(renderedWindow);
}

test("the authored Markdown policy keeps learning structure while stripping active raw HTML", () => {
  const tree = {
    type: "root",
    children: [
      element("details", { open: true, onClick: "alert('no')" }, [
        element("summary", {}, [text("Reveal the model")]),
        element("code", { className: ["language-python"] }, [text("x = 1")]),
      ]),
      element("a", { href: "javascript:alert('no')" }, [text("unsafe")]),
      element("script", {}, [text("alert('no')")]),
    ],
  };

  const sanitized = rehypeSanitize(atlasMarkdownSanitizationSchema)(tree);

  assert.equal(sanitized.children.length, 2);
  const [details, unsafeLink] = sanitized.children;
  assert.equal(details.tagName, "details");
  assert.equal(details.properties.open, true);
  assert.equal(details.properties.onClick, undefined);
  assert.equal(details.children[0].tagName, "summary");
  assert.equal(details.children[1].tagName, "code");
  assert.deepEqual(details.children[1].properties.className, ["language-python"]);
  assert.equal(unsafeLink.tagName, "a");
  assert.equal(unsafeLink.properties.href, undefined);
});

test("the Mermaid SVG allowlist removes active, embedded, and external content", () => {
  const purifier = purifierForRenderedWindow();
  const sanitized = purifier.sanitize(
    `<svg viewBox="0 0 10 10" onload="alert('no')">
      <script>alert('no')</script>
      <foreignObject><div onclick="alert('no')">unsafe</div></foreignObject>
      <image href="https://attacker.example/track.svg" />
      <a href="javascript:alert('no')"><text>unsafe link</text></a>
      <rect class="node" width="10" height="10" style="fill: red" onclick="alert('no')" />
      <path d="M 0 0 L 10 10" marker-end="url(#arrow)" />
      <text x="1" y="5">safe teaching diagram</text>
    </svg>`,
    atlasMermaidSvgSanitizationConfig,
  );

  assert.match(sanitized, /<svg\b/i);
  assert.match(sanitized, /<rect\b/i);
  assert.match(sanitized, /<path\b/i);
  assert.match(sanitized, /<text\b/i);
  assert.match(sanitized, /safe teaching diagram/i);
  assert.doesNotMatch(sanitized, /<script\b|<foreignObject\b|<image\b|<a\b/i);
  assert.doesNotMatch(sanitized, /onload=|onclick=|javascript:|https:\/\/attacker\.example|style=/i);

  const svg = new renderedWindow.DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">
      <path marker-end="url(https://attacker.example/arrow)" />
      <rect fill="url(https://attacker.example/paint.svg)" />
    </svg>`,
    "image/svg+xml",
  ).documentElement;
  removeNonLocalMermaidReferences(svg);
  assert.equal(svg.querySelector("path").getAttribute("marker-end"), null);
  assert.equal(svg.querySelector("rect").getAttribute("fill"), null);
});

test("a rendered Mermaid fixture retains readable labels and inert geometry", async () => {
  const markup = await renderSafeMermaidSvg({
    label: "Concept diagram: a safe route",
    describedById: "m99-safe-route-alternative",
    renderId: "atlas-rendered-fixture",
    source: `flowchart LR
      A["First concept<br/>a value"] --> B{"Decision?"}
      B -- "yes" --> C["Outcome"]`,
  });
  const svg = new renderedWindow.DOMParser().parseFromString(markup, "image/svg+xml").documentElement;

  assert.equal(svg.localName, "svg");
  assert.equal(svg.getAttribute("role"), "img");
  assert.equal(svg.getAttribute("aria-label"), "Concept diagram: a safe route");
  assert.equal(svg.getAttribute("aria-describedby"), "m99-safe-route-alternative");
  assert.match(svg.textContent, /First concept/u);
  assert.match(svg.textContent, /a value/u);
  assert.match(svg.textContent, /Decision\?/u);
  assert.match(svg.textContent, /Outcome/u);
  assert.ok(svg.querySelectorAll("rect, polygon, circle").length >= 3);
  assert.ok(svg.querySelectorAll("path").length >= 1);
  assert.doesNotMatch(markup, /<style\b|<filter\b|<foreignObject\b|<image\b|\son\w+=/iu);
});

test("Module 7's authored diagrams render after accessibility metadata is removed", async () => {
  const moduleSeven = await readFile(
    new URL("../content/modules/07_stacks_queues_iteration_lazy.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleSeven, {
    sourcePath: "content/modules/07_stacks_queues_iteration_lazy.md",
  });

  assert.equal(blocks.length, 10);
  for (const [index, block] of blocks.entries()) {
    const markup = await renderSafeMermaidSvg({
      label: block.metadata.title,
      describedById: `${block.metadata.id}-alternative`,
      renderId: `atlas-m07-render-${index + 1}`,
      source: block.renderSource,
    });
    assert.match(markup, /<svg\b/iu);
    assert.doesNotMatch(markup, /<script\b|<foreignObject\b|\son\w+=/iu);
  }
});

test("Module 8's authored diagrams render after accessibility metadata is removed", async () => {
  const moduleEight = await readFile(
    new URL("../content/modules/08_hashing_dictionaries_sets_indexing.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleEight, {
    sourcePath: "content/modules/08_hashing_dictionaries_sets_indexing.md",
  });

  assert.equal(blocks.length, 9);
  for (const [index, block] of blocks.entries()) {
    const markup = await renderSafeMermaidSvg({
      label: block.metadata.title,
      describedById: `${block.metadata.id}-alternative`,
      renderId: `atlas-m08-render-${index + 1}`,
      source: block.renderSource,
    });
    assert.match(markup, /<svg\b/iu);
    assert.doesNotMatch(markup, /<script\b|<foreignObject\b|\son\w+=/iu);
  }
});

test("Module 29's authored prerequisite map renders after accessibility metadata is removed", async () => {
  const moduleTwentyNine = await readFile(
    new URL("../content/modules/29_calculus_real_analysis_continuous_change.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleTwentyNine, {
    sourcePath: "content/modules/29_calculus_real_analysis_continuous_change.md",
  });

  assert.ok(blocks.length >= 1);
  assert.ok(
    blocks.some((block) => block.metadata?.id === "m29-continuous-change-prerequisite-map"),
    "the authored prerequisite map must remain present",
  );

  // Every authored diagram in the module must survive metadata stripping and
  // render to inert SVG, not just the first one.
  for (const [index, block] of blocks.entries()) {
    const markup = await renderSafeMermaidSvg({
      label: block.metadata.title,
      describedById: `${block.metadata.id}-alternative`,
      renderId: `atlas-m29-render-${index + 1}`,
      source: block.renderSource,
    });
    assert.match(markup, /<svg\b/iu);
    assert.doesNotMatch(markup, /<script\b|<foreignObject\b|\son\w+=/iu);
  }
});

test("M31's hidden review candidate renders its authored diagram alternatives without opening a reader route", async () => {
  const candidate = await readFile(
    new URL("../content/modules/31_optimization_information.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(candidate, {
    sourcePath: "content/modules/31_optimization_information.md",
  });

  // A floor: the point of this test is that every authored diagram renders and
  // stays behind the hidden route, not that the module has exactly three.
  assert.ok(blocks.length >= 3);
  for (const [index, block] of blocks.entries()) {
    assert.ok(block.metadata?.id?.startsWith("m31-"));
    assert.ok(block.metadata?.title);
    assert.ok(block.metadata?.alternative);

    const markup = await renderSafeMermaidSvg({
      label: block.metadata.title,
      describedById: `${block.metadata.id}-alternative`,
      renderId: `atlas-m31-hidden-candidate-${index + 1}`,
      source: block.renderSource,
    });
    const svg = new renderedWindow.DOMParser().parseFromString(
      markup,
      "image/svg+xml",
    ).documentElement;

    assert.equal(svg.localName, "svg");
    assert.equal(svg.getAttribute("role"), "img");
    assert.equal(svg.getAttribute("aria-label"), block.metadata.title);
    assert.equal(svg.getAttribute("aria-describedby"), `${block.metadata.id}-alternative`);
    assert.equal(svg.getAttribute("focusable"), "false");
    assert.doesNotMatch(markup, /<script\b|<foreignObject\b|\son\w+=/iu);
  }
});
