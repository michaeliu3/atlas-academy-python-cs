/**
 * The shared drawing surface for Atlas figures.
 *
 * `lib/atlas-figure.mjs` turns a declarative spec into a flat list of inert
 * scene primitives; this module turns that list into SVG elements. It is
 * deliberately separate from the module-reader `AtlasFigure` wrapper so the
 * mathematics studios can draw the same geometry, with the same classes and
 * the same accessibility contract, without importing the reader's markdown
 * metadata handling.
 *
 * Every attribute below is a number or a class name computed by the builder,
 * and label text is placed as a React child so React escapes it. Nothing here
 * interpolates author input into markup, so a figure needs no HTML sanitising
 * pass and no client-side drawing step.
 */

/** The three anchors `buildAtlasFigure` emits, matching SVG's own values. */
type TextAnchor = "start" | "middle" | "end";

export type ScenePrimitive = {
  t: string;
  cls?: string;
  [key: string]: unknown;
};

function textAnchorOf(value: unknown): TextAnchor {
  return value === "middle" || value === "end" ? value : "start";
}

function Primitive({ item, index }: { item: ScenePrimitive; index: number }) {
  const className = item.cls
    ? `atlas-figure-${String(item.cls).split(" ").join(" atlas-figure-")}`
    : undefined;
  switch (item.t) {
    case "line":
      return (
        <line
          className={className}
          x1={item.x1 as number}
          y1={item.y1 as number}
          x2={item.x2 as number}
          y2={item.y2 as number}
          key={index}
        />
      );
    case "polyline":
      return <polyline className={className} points={item.points as string} key={index} />;
    case "polygon":
      return <polygon className={className} points={item.points as string} key={index} />;
    case "circle":
      return (
        <circle
          className={className}
          cx={item.cx as number}
          cy={item.cy as number}
          r={item.r as number}
          key={index}
        />
      );
    case "rect":
      return (
        <rect
          className={className}
          x={item.x as number}
          y={item.y as number}
          width={item.width as number}
          height={item.height as number}
          key={index}
        />
      );
    case "text":
      return (
        <text
          className={className}
          x={item.x as number}
          y={item.y as number}
          textAnchor={textAnchorOf(item.anchor)}
          transform={
            typeof item.rotate === "number" ? `rotate(${item.rotate} ${item.x} ${item.y})` : undefined
          }
          key={index}
        >
          {String(item.text ?? "")}
        </text>
      );
    default:
      return null;
  }
}

export type AtlasFigureSceneProps = {
  viewBox: { width: number; height: number };
  scene: ReadonlyArray<ScenePrimitive>;
  /** Announced as the image's name. */
  label: string;
  /** The id of the element holding this figure's prose alternative. */
  describedById: string;
};

export function AtlasFigureScene({ viewBox, scene, label, describedById }: AtlasFigureSceneProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      aria-describedby={describedById}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {scene.map((item, index) => (
        <Primitive item={item} index={index} key={index} />
      ))}
    </svg>
  );
}
