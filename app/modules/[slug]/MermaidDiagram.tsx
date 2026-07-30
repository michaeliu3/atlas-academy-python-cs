"use client";

import { useEffect, useId, useState } from "react";
import { renderSafeMermaidSvg } from "@/lib/render-safe-mermaid.mjs";

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
        const renderId = `atlas-diagram-${reactId.replace(/[^a-z0-9]/giu, "")}`;
        const safeMarkup = await renderSafeMermaidSvg({
          label,
          renderId,
          source,
        });

        if (!cancelled) {
          setMarkup(safeMarkup);
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
              ? "The visual diagram could not be drawn. The authored Mermaid source remains available below; consult the surrounding lesson prose for its explanation."
              : "Drawing concept diagram…"}
          </p>
        )}
      </div>
      <figcaption>{label}</figcaption>
      <details className="diagram-source">
        <summary>Diagram source (technical fallback)</summary>
        <pre>
          <code className="language-mermaid">{source}</code>
        </pre>
      </details>
    </figure>
  );
}
