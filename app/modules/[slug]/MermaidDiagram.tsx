"use client";

import { useEffect, useId, useState } from "react";
import {
  hasCompleteMermaidAccessibilityMetadata,
  parseMermaidAccessibilityMetadata,
} from "@/lib/mermaid-accessibility.mjs";
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

function localDescriptionId(reactId: string) {
  return `atlas-diagram-${reactId.replace(/[^a-z0-9]/giu, "")}-alternative`;
}

function safeAuthorDescriptionId(id: string | null | undefined) {
  return id && /^[A-Za-z][A-Za-z0-9_-]*$/u.test(id)
    ? `${id}-alternative`
    : null;
}

export function MermaidDiagram({ source }: MermaidDiagramProps) {
  const reactId = useId();
  const [markup, setMarkup] = useState("");
  const [failed, setFailed] = useState(false);
  const parsed = parseMermaidAccessibilityMetadata(source);
  const metadata = parsed.metadata;
  const hasCompleteAuthoredAlternative = hasCompleteMermaidAccessibilityMetadata(parsed);
  const descriptionId = (
    hasCompleteAuthoredAlternative
      ? safeAuthorDescriptionId(metadata?.id)
      : null
  ) ?? localDescriptionId(reactId);
  const label = hasCompleteAuthoredAlternative && metadata?.title
    ? `Concept diagram: ${metadata.title}`
    : diagramLabel(parsed.renderSource);
  const alternative = hasCompleteAuthoredAlternative && metadata?.alternative
    ? metadata.alternative
    : "Authoring migration note: this visual does not yet have a concise prose alternative. Use the surrounding lesson explanation and the technical source; it cannot satisfy a promotion requirement until an authored alternative is added.";
  const renderingFailureMessage = hasCompleteAuthoredAlternative
    ? "The visual diagram could not be drawn. Its authored text alternative remains below, and the technical source is available for inspection."
    : "The visual diagram could not be drawn. It also lacks an authored text alternative; use the surrounding lesson explanation and the technical source below.";

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const renderId = `atlas-diagram-${reactId.replace(/[^a-z0-9]/giu, "")}`;
        const safeMarkup = await renderSafeMermaidSvg({
          describedById: descriptionId,
          label,
          renderId,
          source: parsed.renderSource,
        });

        if (!cancelled) {
          setFailed(false);
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
  }, [descriptionId, label, parsed.renderSource, reactId]);

  return (
    <figure
      className="mermaid-figure"
      data-atlas-visual-id={hasCompleteAuthoredAlternative ? metadata?.id : undefined}
    >
      <div className="diagram-canvas" aria-busy={!markup && !failed}>
        {markup ? (
          <div dangerouslySetInnerHTML={{ __html: markup }} />
        ) : (
          <p role={failed ? "alert" : "status"}>
            {failed
              ? renderingFailureMessage
              : "Drawing concept diagram…"}
          </p>
        )}
      </div>
      <figcaption>{label}</figcaption>
      <p
        className="diagram-alternative"
        data-authored-alternative={hasCompleteAuthoredAlternative ? "true" : "false"}
        id={descriptionId}
      >
        <strong>{hasCompleteAuthoredAlternative ? "Text alternative:" : "Text alternative status:"}</strong>{" "}
        {alternative}
      </p>
      <details className="diagram-source">
        <summary>Diagram source (technical fallback)</summary>
        <pre aria-label="Scrollable technical Mermaid diagram source" tabIndex={0}>
          <code className="language-mermaid">{parsed.renderSource}</code>
        </pre>
      </details>
    </figure>
  );
}
