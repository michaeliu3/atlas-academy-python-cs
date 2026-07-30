/**
 * Rich course content is authored in-repository, but it still crosses two
 * parser boundaries: raw HTML in Markdown and SVG returned by Mermaid. These
 * allowlists deliberately describe the small rendering languages Atlas needs;
 * they are not a trust decision based on where a string originated.
 */

const markdownAllowedTags = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "details",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "input",
  "kbd",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "samp",
  "section",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
  "var",
];

const markdownCommonAttributes = [
  "abbr",
  "align",
  "ariaDescribedBy",
  "ariaLabel",
  "ariaLabelledBy",
  "className",
  "colSpan",
  "dir",
  "headers",
  "id",
  "lang",
  "open",
  "rowSpan",
  "scope",
  "title",
];

/**
 * `rehype-sanitize` consumes a HAST schema. Markdown syntax produces the
 * ordinary structural tags; the only authored raw HTML currently needed is
 * details/summary/br. Images, inline styles, forms, SVG, media, templates,
 * and executable/embedded elements intentionally have no place in this
 * schema.
 */
export const atlasMarkdownSanitizationSchema = Object.freeze({
  allowComments: false,
  attributes: {
    "*": markdownCommonAttributes,
    a: ["href"],
    blockquote: ["cite"],
    code: ["className"],
    del: ["cite"],
    input: [
      ["checked", true],
      ["disabled", true],
      ["type", "checkbox"],
    ],
    li: ["className"],
    ol: ["className"],
    section: ["dataFootnotes"],
    ul: ["className"],
  },
  clobberPrefix: "atlas-content-",
  protocols: {
    cite: ["http", "https"],
    href: ["http", "https", "mailto"],
  },
  strip: ["embed", "form", "iframe", "math", "object", "script", "style", "svg", "template"],
  tagNames: markdownAllowedTags,
});

const mermaidAllowedTags = [
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "line",
  "marker",
  "path",
  "polygon",
  "polyline",
  "rect",
  "svg",
  "text",
  "title",
  "tspan",
];

const mermaidAllowedAttributes = [
  "class",
  "cx",
  "cy",
  "d",
  "dominant-baseline",
  "dx",
  "dy",
  "fill",
  "fill-opacity",
  "fill-rule",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "height",
  "id",
  "letter-spacing",
  "marker-end",
  "marker-height",
  "marker-mid",
  "marker-start",
  "marker-units",
  "marker-width",
  "opacity",
  "orient",
  "points",
  "preserve-aspect-ratio",
  "r",
  "refx",
  "refy",
  "role",
  "rx",
  "ry",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "text-length",
  "transform",
  "viewbox",
  "width",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
];

const forbiddenSvgElements = [
  "a",
  "animate",
  "animatemotion",
  "animatetransform",
  "audio",
  "embed",
  "filter",
  "foreignobject",
  "iframe",
  "image",
  "object",
  "script",
  "set",
  "style",
  "use",
  "video",
];

const localSvgReference = /^url\(\s*#[A-Za-z][A-Za-z0-9:._-]*\s*\)$/u;
const markerReferenceAttributes = ["marker-end", "marker-mid", "marker-start"];
const paintReferenceAttributes = ["fill", "stroke"];
const svgUrlFunction = /\burl\s*\(/iu;

/**
 * Mermaid diagrams are instructional pictures, not a general SVG execution
 * surface. This is an Atlas-owned allowlist of the inert geometry, text, and
 * presentation attributes produced by the supported diagram types. It does
 * not inherit DOMPurify's full SVG profile. In particular it excludes links,
 * image/media loads, styles, foreignObject/HTML, filters, animation, and
 * every event handler.
 */
export const atlasMermaidSvgSanitizationConfig = Object.freeze({
  ALLOWED_ATTR: mermaidAllowedAttributes,
  ALLOWED_TAGS: mermaidAllowedTags,
  ALLOW_ARIA_ATTR: false,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  FORBID_ATTR: ["href", "style", "xlink:href"],
  FORBID_CONTENTS: forbiddenSvgElements,
  FORBID_TAGS: forbiddenSvgElements,
  // Keep text inside allowed geometry and text elements. Explicitly forbidden
  // active/container elements above still lose their contents.
  KEEP_CONTENT: true,
  RETURN_TRUSTED_TYPE: false,
  SAFE_FOR_XML: true,
  SANITIZE_DOM: true,
});

/**
 * DOMPurify owns structural allowlisting. This narrow postcondition only
 * admits marker links that stay inside the sanitized SVG; it never adds or
 * rewrites markup. SVG URL-valued attributes are otherwise intentionally not
 * admitted to the policy.
 */
export function removeNonLocalMermaidReferences(svg) {
  for (const element of svg.querySelectorAll("*")) {
    for (const attribute of markerReferenceAttributes) {
      const value = element.getAttribute(attribute);
      if (value !== null && !localSvgReference.test(value)) {
        element.removeAttribute(attribute);
      }
    }
    for (const attribute of paintReferenceAttributes) {
      const value = element.getAttribute(attribute);
      // Gradients/patterns are not part of the Atlas SVG language, so a paint
      // URL has no legitimate local use and is removed rather than normalized.
      if (value !== null && svgUrlFunction.test(value)) {
        element.removeAttribute(attribute);
      }
    }
  }
  return svg;
}
