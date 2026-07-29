"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  source: string;
};

function diagramLabel(source: string) {
  const lines = source
    .split(/\r?\n/u)
    .map((line) => line.trim());
  const authoredCaption = lines.find((line) => /^%%\s+\S/u.test(line));
  if (authoredCaption) {
    return `Concept diagram: ${authoredCaption.replace(/^%%\s*/u, "").slice(0, 100)}`;
  }

  const descriptiveLine = lines
    .find((line) => line && !/^(graph|flowchart|sequenceDiagram|classDiagram)\b/iu.test(line));

  return descriptiveLine
    ? `Concept diagram: ${descriptiveLine.slice(0, 100)}`
    : "Concept diagram for this lesson";
}

export function MermaidDiagram({ source }: MermaidDiagramProps) {
  const reactId = useId();
  const [markup, setMarkup] = useState("");
  const [failed, setFailed] = useState(false);
  const label = diagramLabel(source);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
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
        const renderId = `atlas-diagram-${reactId.replace(/[^a-z0-9]/giu, "")}`;
        const result = await mermaid.render(renderId, source);
        const documentFragment = new DOMParser().parseFromString(
          result.svg,
          "image/svg+xml",
        );
        const svg = documentFragment.documentElement;
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", label);
        svg.setAttribute("focusable", "false");

        if (!cancelled) {
          setMarkup(new XMLSerializer().serializeToString(svg));
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    }

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [label, reactId, source]);

  return (
    <figure className="mermaid-figure">
      <div className="diagram-canvas" aria-busy={!markup && !failed}>
        {markup ? (
          <div dangerouslySetInnerHTML={{ __html: markup }} />
        ) : (
          <p role={failed ? "alert" : "status"}>
            {failed
              ? "The visual diagram could not be drawn. Its complete source remains available below."
              : "Drawing concept diagram…"}
          </p>
        )}
      </div>
      <figcaption>{label}</figcaption>
      <details className="diagram-source">
        <summary>Diagram source and text fallback</summary>
        <pre>
          <code className="language-mermaid">{source}</code>
        </pre>
      </details>
    </figure>
  );
}
