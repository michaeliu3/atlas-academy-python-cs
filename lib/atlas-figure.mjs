/**
 * Atlas figures — a declarative drawing language for workbook mathematics.
 *
 * Why this exists: the Markdown sanitiser strips `svg` and disallows `img`
 * (see `rich-content-sanitization.mjs`), so before this module a figure could
 * not be authored at all. Every workbook visual was a Mermaid flowchart, which
 * cannot express a projection, a convergence curve, or a distribution tail —
 * and the mathematics arc had one diagram per module as a result.
 *
 * Two decisions shape the design:
 *
 * 1. **Authors supply data, not expressions.** A series carries explicit
 *    points. Nothing here evaluates a formula, so a figure cannot drift from
 *    the mathematics it claims to depict, and there is no expression
 *    interpreter to sandbox.
 * 2. **This module emits geometry, not markup.** It returns a scene of inert
 *    primitives with computed coordinates; the React component maps them to
 *    elements. Text is escaped by React rather than by string concatenation,
 *    the whole layout is testable without a DOM, and figures render on the
 *    server with no client-side drawing step.
 */

const figureKinds = new Set(["vector2d", "plot", "bars"]);

const defaultViewBox = { width: 640, height: 400 };
const defaultMargin = { top: 28, right: 28, bottom: 44, left: 52 };

class FigureSpecError extends Error {}

function fail(message) {
  throw new FigureSpecError(message);
}

function finiteNumber(value, what) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(`${what} must be a finite number`);
  }
  return value;
}

function readPoint(value, what) {
  if (!Array.isArray(value) || value.length !== 2) {
    fail(`${what} must be a [x, y] pair`);
  }
  return [finiteNumber(value[0], `${what} x`), finiteNumber(value[1], `${what} y`)];
}

function readRange(value, what, fallback) {
  if (value === undefined) return fallback;
  const [low, high] = readPoint(value, what);
  if (!(high > low)) fail(`${what} must be increasing`);
  return [low, high];
}

/**
 * Extend a range so that data sitting exactly on a bound is not clipped, and
 * so a degenerate (zero-width) range still produces a drawable axis.
 */
function padRange([low, high]) {
  if (high - low === 0) return [low - 1, high + 1];
  const padding = (high - low) * 0.08;
  return [low - padding, high + padding];
}

function boundsOf(points, explicitX, explicitY) {
  if (explicitX && explicitY) return { x: explicitX, y: explicitY };
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  if (xs.length === 0) return { x: explicitX ?? [0, 1], y: explicitY ?? [0, 1] };
  return {
    x: explicitX ?? padRange([Math.min(...xs), Math.max(...xs)]),
    y: explicitY ?? padRange([Math.min(...ys), Math.max(...ys)]),
  };
}

/**
 * Build the user-space to SVG-space projection. SVG y grows downward, so the
 * y mapping is inverted here once rather than at every call site.
 */
function createProjection(bounds, viewBox, margin) {
  const plotWidth = viewBox.width - margin.left - margin.right;
  const plotHeight = viewBox.height - margin.top - margin.bottom;
  const [x0, x1] = bounds.x;
  const [y0, y1] = bounds.y;
  return {
    x: (value) => margin.left + ((value - x0) / (x1 - x0)) * plotWidth,
    y: (value) => margin.top + plotHeight - ((value - y0) / (y1 - y0)) * plotHeight,
    plotWidth,
    plotHeight,
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

/**
 * An arrowhead is drawn as an explicit polygon rather than an SVG `marker`.
 * Markers need a document-unique id and a `url(#…)` reference, which the
 * project's SVG allowlist deliberately constrains; a polygon has no such
 * coupling and survives any sanitiser unchanged.
 */
function arrowHead(fromX, fromY, toX, toY, size = 9) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const spread = 0.42;
  const points = [
    [toX, toY],
    [toX - size * Math.cos(angle - spread), toY - size * Math.sin(angle - spread)],
    [toX - size * Math.cos(angle + spread), toY - size * Math.sin(angle + spread)],
  ];
  return points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

function axisTicks([low, high], count = 4) {
  const step = (high - low) / count;
  return Array.from({ length: count + 1 }, (_, index) => low + index * step);
}

function tickLabel(value) {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/u, "").replace(/\.$/u, "");
}

function axisScene(projection, bounds, spec) {
  const scene = [];
  const originY = bounds.y[0] <= 0 && bounds.y[1] >= 0 ? projection.y(0) : projection.y(bounds.y[0]);
  const originX = bounds.x[0] <= 0 && bounds.x[1] >= 0 ? projection.x(0) : projection.x(bounds.x[0]);

  scene.push({
    t: "line",
    cls: "axis",
    x1: round(projection.x(bounds.x[0])),
    y1: round(originY),
    x2: round(projection.x(bounds.x[1])),
    y2: round(originY),
  });
  scene.push({
    t: "line",
    cls: "axis",
    x1: round(originX),
    y1: round(projection.y(bounds.y[0])),
    x2: round(originX),
    y2: round(projection.y(bounds.y[1])),
  });

  for (const value of axisTicks(bounds.x)) {
    scene.push({
      t: "text",
      cls: "tick",
      anchor: "middle",
      x: round(projection.x(value)),
      y: round(originY + 16),
      text: tickLabel(value),
    });
  }
  for (const value of axisTicks(bounds.y)) {
    scene.push({
      t: "text",
      cls: "tick",
      anchor: "end",
      x: round(originX - 8),
      y: round(projection.y(value) + 4),
      text: tickLabel(value),
    });
  }

  if (spec.xLabel) {
    scene.push({
      t: "text",
      cls: "axis-label",
      anchor: "middle",
      x: round(projection.x((bounds.x[0] + bounds.x[1]) / 2)),
      y: round(projection.y(bounds.y[0]) + 38),
      text: spec.xLabel,
    });
  }
  if (spec.yLabel) {
    scene.push({
      t: "text",
      cls: "axis-label",
      anchor: "middle",
      x: 14,
      y: round(projection.y((bounds.y[0] + bounds.y[1]) / 2)),
      rotate: -90,
      text: spec.yLabel,
    });
  }
  return scene;
}

function buildVector2d(spec, viewBox, margin) {
  const vectors = Array.isArray(spec.vectors) ? spec.vectors : [];
  const segments = Array.isArray(spec.segments) ? spec.segments : [];
  const marks = Array.isArray(spec.points) ? spec.points : [];
  if (vectors.length === 0 && segments.length === 0 && marks.length === 0) {
    fail("a vector2d figure needs at least one vector, segment, or point");
  }

  const sampled = [
    [0, 0],
    ...vectors.flatMap((vector) => [
      vector.from ? readPoint(vector.from, "vector.from") : [0, 0],
      readPoint(vector.to, "vector.to"),
    ]),
    ...segments.flatMap((segment) => [
      readPoint(segment.from, "segment.from"),
      readPoint(segment.to, "segment.to"),
    ]),
    ...marks.map((point) => readPoint(point.at, "point.at")),
  ];

  const bounds = boundsOf(
    sampled,
    readRange(spec.xRange, "xRange", undefined),
    readRange(spec.yRange, "yRange", undefined),
  );
  const projection = createProjection(bounds, viewBox, margin);
  const scene = axisScene(projection, bounds, spec);

  for (const segment of segments) {
    const [fx, fy] = readPoint(segment.from, "segment.from");
    const [tx, ty] = readPoint(segment.to, "segment.to");
    scene.push({
      t: "line",
      cls: segment.style === "dashed" ? "guide dashed" : "guide",
      x1: round(projection.x(fx)),
      y1: round(projection.y(fy)),
      x2: round(projection.x(tx)),
      y2: round(projection.y(ty)),
    });
    if (segment.label) {
      scene.push({
        t: "text",
        cls: "series-label",
        anchor: "middle",
        x: round(projection.x((fx + tx) / 2) + 10),
        y: round(projection.y((fy + ty) / 2) - 6),
        text: segment.label,
      });
    }
  }

  vectors.forEach((vector, index) => {
    const [fx, fy] = vector.from ? readPoint(vector.from, "vector.from") : [0, 0];
    const [tx, ty] = readPoint(vector.to, "vector.to");
    const sx = projection.x(fx);
    const sy = projection.y(fy);
    const ex = projection.x(tx);
    const ey = projection.y(ty);
    const tone = `tone-${(vector.tone ?? index) % 5}`;
    scene.push({ t: "line", cls: `vector ${tone}`, x1: round(sx), y1: round(sy), x2: round(ex), y2: round(ey) });
    scene.push({ t: "polygon", cls: `vector-head ${tone}`, points: arrowHead(sx, sy, ex, ey) });
    if (vector.label) {
      scene.push({
        t: "text",
        cls: `series-label ${tone}`,
        anchor: ex >= sx ? "start" : "end",
        x: round(ex + (ex >= sx ? 8 : -8)),
        y: round(ey - 6),
        text: vector.label,
      });
    }
  });

  for (const point of marks) {
    const [px, py] = readPoint(point.at, "point.at");
    scene.push({ t: "circle", cls: "point", cx: round(projection.x(px)), cy: round(projection.y(py)), r: 3.5 });
    if (point.label) {
      scene.push({
        t: "text",
        cls: "series-label",
        anchor: "start",
        x: round(projection.x(px) + 8),
        y: round(projection.y(py) - 8),
        text: point.label,
      });
    }
  }

  // A right-angle mark is the whole point of a projection figure, so it is a
  // first-class primitive rather than something an author fakes with segments.
  for (const angle of Array.isArray(spec.rightAngles) ? spec.rightAngles : []) {
    const [ax, ay] = readPoint(angle.at, "rightAngle.at");
    if (!Array.isArray(angle.toward) || angle.toward.length !== 2) {
      fail("rightAngle.toward must be two points naming the directions the angle sits between");
    }
    const [t1x, t1y] = readPoint(angle.toward[0], "rightAngle.toward[0]");
    const [t2x, t2y] = readPoint(angle.toward[1], "rightAngle.toward[1]");
    const cx = projection.x(ax);
    const cy = projection.y(ay);
    const unit = (px, py) => {
      const dx = projection.x(px) - cx;
      const dy = projection.y(py) - cy;
      const length = Math.hypot(dx, dy) || 1;
      return [(dx / length) * 13, (dy / length) * 13];
    };
    const [u1x, u1y] = unit(t1x, t1y);
    const [u2x, u2y] = unit(t2x, t2y);
    scene.push({
      t: "polyline",
      cls: "right-angle",
      points: [
        [cx + u1x, cy + u1y],
        [cx + u1x + u2x, cy + u1y + u2y],
        [cx + u2x, cy + u2y],
      ]
        .map(([x, y]) => `${round(x)},${round(y)}`)
        .join(" "),
    });
  }

  return scene;
}

function buildPlot(spec, viewBox, margin) {
  const series = Array.isArray(spec.series) ? spec.series : [];
  if (series.length === 0) fail("a plot figure needs at least one series");

  const allPoints = series.flatMap((entry, index) => {
    if (!Array.isArray(entry.points) || entry.points.length < 2) {
      fail(`series ${index} needs at least two points`);
    }
    return entry.points.map((point) => readPoint(point, `series ${index} point`));
  });

  const bounds = boundsOf(
    allPoints,
    readRange(spec.xRange, "xRange", undefined),
    readRange(spec.yRange, "yRange", undefined),
  );
  const projection = createProjection(bounds, viewBox, margin);
  const scene = axisScene(projection, bounds, spec);

  series.forEach((entry, index) => {
    const points = entry.points.map((point) => readPoint(point, "series point"));
    const tone = `tone-${(entry.tone ?? index) % 5}`;
    const path = points.map(([x, y]) => `${round(projection.x(x))},${round(projection.y(y))}`).join(" ");

    if (entry.fill) {
      const base = Math.max(bounds.y[0], 0);
      scene.push({
        t: "polygon",
        cls: `series-fill ${tone}`,
        points: `${round(projection.x(points[0][0]))},${round(projection.y(base))} ${path} ${round(
          projection.x(points[points.length - 1][0]),
        )},${round(projection.y(base))}`,
      });
    }

    scene.push({
      t: "polyline",
      cls: `series ${tone}${entry.style === "dashed" ? " dashed" : ""}`,
      points: path,
    });

    if (entry.label) {
      const [lx, ly] = points[points.length - 1];
      scene.push({
        t: "text",
        cls: `series-label ${tone}`,
        anchor: "end",
        x: round(projection.x(lx) - 4),
        y: round(projection.y(ly) - 8),
        text: entry.label,
      });
    }
  });

  for (const marker of Array.isArray(spec.points) ? spec.points : []) {
    const [px, py] = readPoint(marker.at, "point.at");
    scene.push({ t: "circle", cls: "point", cx: round(projection.x(px)), cy: round(projection.y(py)), r: 3.5 });
    if (marker.label) {
      scene.push({
        t: "text",
        cls: "series-label",
        anchor: "start",
        x: round(projection.x(px) + 8),
        y: round(projection.y(py) - 8),
        text: marker.label,
      });
    }
  }

  return scene;
}

function buildBars(spec, viewBox, margin) {
  const bars = Array.isArray(spec.bars) ? spec.bars : [];
  if (bars.length === 0) fail("a bars figure needs at least one bar");

  const values = bars.map((bar, index) => finiteNumber(bar.value, `bar ${index} value`));
  const maximum = Math.max(...values, 0);
  const minimum = Math.min(...values, 0);
  const bounds = { x: [0, bars.length], y: readRange(spec.yRange, "yRange", padRange([minimum, maximum])) };
  const projection = createProjection(bounds, viewBox, margin);

  const scene = [];
  const zeroY = projection.y(Math.max(bounds.y[0], 0));
  scene.push({
    t: "line",
    cls: "axis",
    x1: round(projection.x(0)),
    y1: round(zeroY),
    x2: round(projection.x(bars.length)),
    y2: round(zeroY),
  });

  const slot = projection.plotWidth / bars.length;
  bars.forEach((bar, index) => {
    const value = values[index];
    const top = projection.y(Math.max(value, 0));
    const bottom = projection.y(Math.min(value, 0));
    const left = projection.x(index) + slot * 0.18;
    scene.push({
      t: "rect",
      cls: `bar tone-${(bar.tone ?? index) % 5}`,
      x: round(left),
      y: round(top),
      width: round(slot * 0.64),
      height: round(Math.max(bottom - top, 1)),
    });
    scene.push({
      t: "text",
      cls: "tick",
      anchor: "middle",
      x: round(left + slot * 0.32),
      y: round(projection.y(bounds.y[0]) + 16),
      text: String(bar.label ?? index + 1),
    });
    scene.push({
      t: "text",
      cls: "bar-value",
      anchor: "middle",
      x: round(left + slot * 0.32),
      y: round(top - 6),
      text: tickLabel(value),
    });
  });

  if (spec.yLabel) {
    scene.push({
      t: "text",
      cls: "axis-label",
      anchor: "middle",
      x: 14,
      y: round(projection.y((bounds.y[0] + bounds.y[1]) / 2)),
      rotate: -90,
      text: spec.yLabel,
    });
  }
  return scene;
}

/**
 * One inert drawing instruction. `t` names the SVG element to emit; the
 * remaining fields are numbers, class names, or label text.
 *
 * @typedef {{ t: string, cls?: string, text?: string, [key: string]: unknown }} ScenePrimitive
 */

/**
 * @typedef {{
 *   kind: string,
 *   viewBox: { width: number, height: number },
 *   scene: ScenePrimitive[],
 * }} AtlasFigureLayout
 */

/**
 * Parse and lay out one figure.
 *
 * @param {string} source JSON spec body (metadata comments already removed)
 * @returns {{ ok: true, figure: AtlasFigureLayout } | { ok: false, error: string }}
 */
export function buildAtlasFigure(source) {
  let spec;
  try {
    spec = JSON.parse(source);
  } catch (error) {
    return { ok: false, error: `figure spec is not valid JSON: ${error.message}` };
  }

  try {
    if (!spec || typeof spec !== "object" || Array.isArray(spec)) fail("figure spec must be a JSON object");
    if (!figureKinds.has(spec.kind)) {
      fail(`unknown figure kind ${JSON.stringify(spec.kind)}; expected one of ${[...figureKinds].join(", ")}`);
    }

    const viewBox = {
      width: spec.width ? finiteNumber(spec.width, "width") : defaultViewBox.width,
      height: spec.height ? finiteNumber(spec.height, "height") : defaultViewBox.height,
    };
    const margin = { ...defaultMargin, ...(spec.margin ?? {}) };

    const scene =
      spec.kind === "vector2d"
        ? buildVector2d(spec, viewBox, margin)
        : spec.kind === "plot"
          ? buildPlot(spec, viewBox, margin)
          : buildBars(spec, viewBox, margin);

    return { ok: true, figure: { kind: spec.kind, viewBox, scene } };
  } catch (error) {
    if (error instanceof FigureSpecError) return { ok: false, error: error.message };
    return { ok: false, error: `figure spec could not be laid out: ${error.message}` };
  }
}
