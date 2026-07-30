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
 * Render Mermaid in the browser, then pass its generated SVG through the
 * Atlas allowlist before it can reach an HTML injection boundary. Consumers
 * receive a string only after the sanitized SVG has been parsed and checked
 * to have an SVG root.
 */
export async function renderSafeMermaidSvg({ label, renderId, source }) {
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
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label);
  svg.setAttribute("focusable", "false");
  return new XMLSerializer().serializeToString(svg);
}
