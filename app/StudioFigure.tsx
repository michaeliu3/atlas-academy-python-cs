import { buildAtlasFigure } from "@/lib/atlas-figure.mjs";
import { AtlasFigureScene } from "./AtlasFigureScene";

/**
 * A studio-side Atlas figure.
 *
 * The mathematics studios previously drew their geometry with CSS pseudo-shapes
 * marked `aria-hidden`, which meant the picture and the prose alternative had
 * no shared source: a decoration could drift from the fixture it illustrated
 * and nothing would notice. This component draws the same declarative specs the
 * module reader uses, so a studio figure is generated from the numbers the
 * studio already declares in its text.
 *
 * The spec is authored as a literal in the studio, so a layout failure is an
 * authoring bug rather than a runtime condition; it is surfaced rather than
 * swallowed. The prose alternative stays in the studio next to the figure and
 * is referenced by `describedById`, matching the reader's figure contract.
 */
export type StudioFigureProps = {
  /** A `lib/atlas-figure.mjs` spec: `vector2d`, `plot`, or `bars`. */
  spec: Readonly<Record<string, unknown>>;
  /** Announced as the image's name. */
  label: string;
  /** The id of the studio element holding this figure's text equivalent. */
  describedById: string;
};

export function StudioFigure({ spec, label, describedById }: StudioFigureProps) {
  const built = buildAtlasFigure(JSON.stringify(spec));

  return (
    <div className="atlas-figure-canvas">
      {built.ok ? (
        <AtlasFigureScene
          viewBox={built.figure.viewBox}
          scene={built.figure.scene}
          label={label}
          describedById={describedById}
        />
      ) : (
        <p role="alert">
          This figure could not be drawn: {built.error}. Its text equivalent remains below.
        </p>
      )}
    </div>
  );
}
