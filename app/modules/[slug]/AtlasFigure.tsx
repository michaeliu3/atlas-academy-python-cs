import { AtlasFigureScene } from "@/app/AtlasFigureScene";
import { buildAtlasFigure } from "@/lib/atlas-figure.mjs";
import {
  hasCompleteMermaidAccessibilityMetadata,
  parseMermaidAccessibilityMetadata,
} from "@/lib/mermaid-accessibility.mjs";

type AtlasFigureProps = {
  source: string;
};

function safeDescriptionId(id: string | null | undefined, fallback: string) {
  return id && /^[A-Za-z][A-Za-z0-9_-]*$/u.test(id) ? `${id}-alternative` : fallback;
}

/**
 * An Atlas figure: a declarative plot, vector diagram, or bar chart authored in
 * an ```atlas-figure fence. It mirrors the Mermaid figure structure — caption,
 * mandatory text alternative, and a collapsible technical source — so the two
 * visual channels present identically to a reader and to a screen reader. The
 * drawing itself is delegated to `AtlasFigureScene`, which the mathematics
 * studios share.
 */
export function AtlasFigure({ source }: AtlasFigureProps) {
  const parsed = parseMermaidAccessibilityMetadata(source);
  const metadata = parsed.metadata;
  const complete = hasCompleteMermaidAccessibilityMetadata(parsed);
  const built = buildAtlasFigure(parsed.renderSource);

  const descriptionId = safeDescriptionId(metadata?.id, "atlas-figure-alternative");
  const label = complete && metadata?.title ? `Figure: ${metadata.title}` : "Figure for this lesson";
  const alternative =
    complete && metadata?.alternative
      ? metadata.alternative
      : "Authoring note: this figure does not yet have a concise prose alternative. Use the surrounding lesson explanation and the spec below.";

  return (
    <figure className="atlas-figure" data-atlas-visual-id={complete ? metadata?.id : undefined}>
      <div className="atlas-figure-canvas">
        {built.ok ? (
          <AtlasFigureScene
            viewBox={built.figure.viewBox}
            scene={built.figure.scene}
            label={label}
            describedById={descriptionId}
          />
        ) : (
          <p role="alert">
            This figure could not be drawn: {built.error}. Its text alternative remains below.
          </p>
        )}
      </div>
      <figcaption>{label}</figcaption>
      <p
        className="diagram-alternative"
        data-authored-alternative={complete ? "true" : "false"}
        id={descriptionId}
      >
        <strong>{complete ? "Text alternative:" : "Text alternative status:"}</strong> {alternative}
      </p>
      <details className="diagram-source">
        <summary>Figure data (technical fallback)</summary>
        <pre aria-label="Scrollable figure specification" tabIndex={0}>
          <code className="language-json">{parsed.renderSource}</code>
        </pre>
      </details>
    </figure>
  );
}
