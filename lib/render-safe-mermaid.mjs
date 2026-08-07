import {
  atlasMermaidSvgSanitizationConfig,
  removeNonLocalMermaidReferences,
} from "./rich-content-sanitization.mjs";

function configureAtlasMermaid(mermaid) {
  mermaid.initialize({
    htmlLabels: false,
    securityLevel: "strict",
    startOnLoad: false,
    theme: "base",
    fontFamily: "Manrope, system-ui, sans-serif",
    themeVariables: {
      background: "#fffdf7",
      primaryColor: "#dfe7f7",
      primaryTextColor: "#17211d",
      primaryBorderColor: "#3157a4",
      lineColor: "#76547f",
      secondaryColor: "#f3dfc5",
      tertiaryColor: "#dce9df",
    },
  });
}

function purifierForCurrentWindow(dompurify) {
  return typeof dompurify.sanitize === "function" ? dompurify : dompurify(window);
}

/**
 * Mermaid's tight viewBox can cut the final glyph of a node label when the
 * diagram is scaled for a narrow reader or printed page. Add a small
 * geometry-only margin after sanitization so the visual remains readable
 * without trusting authored SVG attributes or styles.
 */
function padSvgViewBox(svg) {
  const raw = svg.getAttribute("viewBox");
  const values = raw?.trim().split(/\s+/u).map(Number);
  if (!values || values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return;
  }
  const [x, y, width, height] = values;
  if (width <= 0 || height <= 0) return;
  const padding = 24;
  svg.setAttribute(
    "viewBox",
    `${x - padding} ${y - padding} ${width + padding * 2} ${height + padding * 2}`,
  );
}

/**
 * Render Mermaid in the browser, then pass its generated SVG through the
 * Atlas allowlist before it can reach an HTML injection boundary. Consumers
 * receive a string only after the sanitized SVG has been parsed and checked
 * to have an SVG root.
 *
 * @param {{ label: string, describedById?: string | null, renderId: string, source: string }} options
 */
export async function renderSafeMermaidSvg({ label, describedById = null, renderId, source }) {
  if (
    describedById !== null &&
    (typeof describedById !== "string" || !/^[A-Za-z][A-Za-z0-9_-]*$/u.test(describedById))
  ) {
    throw new TypeError("Mermaid describedById must be a safe local element ID or null.");
  }
  const [{ default: mermaid }, { default: createDOMPurify }] = await Promise.all([
    import("mermaid"),
    import("dompurify"),
  ]);
  configureAtlasMermaid(mermaid);

  const result = await mermaid.render(renderId, source);
  const purifier = purifierForCurrentWindow(createDOMPurify);
  const sanitizedSvg = purifier.sanitize(
    result.svg,
    atlasMermaidSvgSanitizationConfig,
  );
  const svgDocument = new DOMParser().parseFromString(
    sanitizedSvg,
    "image/svg+xml",
  );
  const svg = svgDocument.documentElement;
  if (svg.localName !== "svg") {
    throw new Error("Mermaid did not produce a safe SVG root.");
  }

  removeNonLocalMermaidReferences(svg);
  padSvgViewBox(svg);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label);
  if (describedById !== null) {
    svg.setAttribute("aria-describedby", describedById);
  }
  svg.setAttribute("focusable", "false");
  return new XMLSerializer().serializeToString(svg);
}
