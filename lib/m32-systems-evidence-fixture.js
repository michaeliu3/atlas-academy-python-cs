/**
 * Small, deterministic M32 reasoning fixtures for code-reading and review.
 *
 * The cards use declared local arrays, event labels, and scalar arithmetic.
 * They do not import an array library, launch a kernel, allocate a device
 * buffer, inspect hardware, call a framework, load data, or persist learner
 * work. Their purpose is to make a few systems claims inspectable before a
 * future platform-specific lab is designed or reviewed.
 */

const FIXTURE_VERSION = "atlas-m32-systems-evidence-fixture/1";

const truthBoundary =
  "These local, finite reasoning cards do not describe a NumPy array, Python buffer export, CUDA/HIP stream, compiler, device, framework graph, trained model, benchmark, real allocation, measured transfer, portability result, race-freedom proof, or permission to make a production decision.";

const declaredStorage = Object.freeze([10, 11, 12, 20, 21, 22]);

const baseLayout = Object.freeze({
  id: "base-row-major-2x3",
  shape: Object.freeze([2, 3]),
  elementStrides: Object.freeze([3, 1]),
  storageOffset: 0,
  aliasesDeclaredStorage: true,
  positiveContiguous: true,
});

const reversedColumnLayout = Object.freeze({
  id: "reversed-columns-view-2x3",
  shape: Object.freeze([2, 3]),
  elementStrides: Object.freeze([3, -1]),
  storageOffset: 2,
  aliasesDeclaredStorage: true,
  positiveContiguous: false,
});

const legalReleasePoint = "after-kernel-complete";
const releasePoints = Object.freeze([
  "after-enqueue",
  "after-copy-complete",
  legalReleasePoint,
]);

export const M32_SYSTEMS_EVIDENCE_FIXTURE = Object.freeze({
  id: "m32-fixed-layout-ownership-autodiff-cards-v1",
  version: FIXTURE_VERSION,
  localOnly: true,
  storage: declaredStorage,
  layouts: Object.freeze({
    base: baseLayout,
    reversedColumns: reversedColumnLayout,
  }),
  legalReleasePoint,
  truthBoundary,
});

function cloneLayout(layout) {
  return {
    ...layout,
    shape: [...layout.shape],
    elementStrides: [...layout.elementStrides],
  };
}

function normalizedIndex(index, extent, axis) {
  if (!Number.isInteger(index) || index < 0 || index >= extent) {
    throw new RangeError(`M32 ${axis} index must be an integer from 0 through ${extent - 1}.`);
  }
  return index;
}

function storageRead(layout, row, column) {
  const normalizedRow = normalizedIndex(row, layout.shape[0], "row");
  const normalizedColumn = normalizedIndex(column, layout.shape[1], "column");
  const storageIndex =
    layout.storageOffset +
    normalizedRow * layout.elementStrides[0] +
    normalizedColumn * layout.elementStrides[1];

  return {
    logicalIndex: [normalizedRow, normalizedColumn],
    storageIndex,
    value: declaredStorage[storageIndex],
  };
}

function normalizedPositiveDimension(value, label) {
  if (!Number.isInteger(value) || value < 1 || value > 4096) {
    throw new RangeError(`${label} must be an integer from 1 through 4096.`);
  }
  return value;
}

function normalizedFiniteScalar(value, label) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number.`);
  }
  return value;
}

/**
 * Contrast two same-shape layouts that read declared storage through different
 * strides. A positive-contiguous-only consumer can accept the base card but
 * not the reversed-column card under this explicit contract.
 */
export function m32LayoutHandoffTrace() {
  const baseReads = [storageRead(baseLayout, 0, 0), storageRead(baseLayout, 1, 2)];
  const reversedReads = [
    storageRead(reversedColumnLayout, 0, 0),
    storageRead(reversedColumnLayout, 1, 2),
  ];

  return {
    id: "m32-s01-s03-layout-handoff-trace",
    base: cloneLayout(baseLayout),
    reversedColumns: cloneLayout(reversedColumnLayout),
    sameShape: JSON.stringify(baseLayout.shape) === JSON.stringify(reversedColumnLayout.shape),
    sameStrides:
      JSON.stringify(baseLayout.elementStrides) ===
      JSON.stringify(reversedColumnLayout.elementStrides),
    declaredConsumerContract: {
      requires: "rank-2, positive-contiguous, aliases-permitted input",
      acceptsBase: baseLayout.positiveContiguous,
      acceptsReversedColumns: reversedColumnLayout.positiveContiguous,
    },
    reads: {
      base: baseReads,
      reversedColumns: reversedReads,
    },
    conclusion:
      "The cards have the same declared shape and alias the same fixed storage, but their strides and logical-to-storage reads differ. Under this declared positive-contiguous consumer contract, the reversed view needs a different handoff path before any no-copy claim.",
    truthBoundary,
  };
}

/**
 * Calculate only the symbolic element counts for the pairwise broadcasting
 * expression in M32-S03. It reports a logical temporary shape; it does not
 * report a real allocation, execution plan, or measured memory footprint.
 *
 * @param {{ n: number, k: number, d: number }} dimensions
 */
export function m32PairwiseTemporaryCard({ n, k, d }) {
  const normalizedN = normalizedPositiveDimension(n, "M32 n");
  const normalizedK = normalizedPositiveDimension(k, "M32 k");
  const normalizedD = normalizedPositiveDimension(d, "M32 d");
  const temporaryElements = normalizedN * normalizedK * normalizedD;
  const outputElements = normalizedN * normalizedK;

  if (temporaryElements > 16_777_216) {
    throw new RangeError("M32 symbolic temporary must contain at most 16,777,216 elements.");
  }

  return {
    id: "m32-s03-pairwise-temporary-shape-card",
    inputs: {
      pointsShape: [normalizedN, normalizedD],
      centersShape: [normalizedK, normalizedD],
    },
    logicalDifferenceShape: [normalizedN, normalizedK, normalizedD],
    logicalOutputShape: [normalizedN, normalizedK],
    temporaryElements,
    outputElements,
    temporaryToOutputElementRatio: temporaryElements / outputElements,
    conclusion:
      "The displayed expression has a logical (n, k, d) difference shape before its (n, k) reduction. That shape identifies a resource question to investigate; it does not show whether a particular backend materializes the temporary or how fast either implementation runs.",
    truthBoundary,
  };
}

function normalizedReleasePoint(releasePoint) {
  if (!releasePoints.includes(releasePoint)) {
    throw new RangeError(
      `M32 release point must be one of: ${releasePoints.map((point) => `'${point}'`).join(", ")}.`,
    );
  }
  return releasePoint;
}

/**
 * Make the declared last-use condition explicit for one local staging-slot
 * timeline. The events are labels, not a concurrency simulator.
 *
 * @param {"after-enqueue" | "after-copy-complete" | "after-kernel-complete"} releasePoint
 */
export function m32BufferReuseTimeline(releasePoint) {
  const normalizedRelease = normalizedReleasePoint(releasePoint);
  const reuseSafe = normalizedRelease === legalReleasePoint;

  return {
    id: "m32-s04-buffer-last-use-timeline",
    releaseAttempt: normalizedRelease,
    legalReleasePoint,
    reuseSafe,
    events: [
      { event: "reserved", slotState: "caller owns staging slot" },
      { event: "copy-enqueued", slotState: "copy may still read staging slot" },
      { event: "copy-complete", slotState: "kernel may still read staging slot" },
      { event: "kernel-complete", slotState: "declared last use has completed" },
    ],
    conclusion: reuseSafe
      ? "The declared last consumer has completed, so this local timeline permits reuse."
      : "The declared last consumer may still read the slot, so this local timeline rejects reuse.",
    truthBoundary:
      "This fixed event-label timeline is not a CUDA/HIP/JAX/PyTorch execution trace, a device synchronization test, a race detector, an overlap measurement, or a proof of race freedom/liveness for another runtime.",
  };
}

function scalarLoss(theta, x, y) {
  return (theta * x - y) ** 2;
}

/**
 * Trace one scalar chain rule and an independent central finite-difference
 * comparison. The function is a manual arithmetic card, not framework
 * autodiff, a numerical-stability certificate, or an objective review.
 *
 * @param {{ theta: number, x: number, y: number, step?: number }} configuration
 */
export function m32ScalarReverseModeTrace({ theta, x, y, step = 1e-5 }) {
  const normalizedTheta = normalizedFiniteScalar(theta, "M32 theta");
  const normalizedX = normalizedFiniteScalar(x, "M32 x");
  const normalizedY = normalizedFiniteScalar(y, "M32 y");
  const normalizedStep = normalizedFiniteScalar(step, "M32 finite-difference step");
  if (normalizedStep <= 0) {
    throw new RangeError("M32 finite-difference step must be positive.");
  }

  const product = normalizedTheta * normalizedX;
  const residual = product - normalizedY;
  const loss = residual ** 2;
  const analyticGradient = 2 * residual * normalizedX;
  const centralDifferenceGradient =
    (scalarLoss(normalizedTheta + normalizedStep, normalizedX, normalizedY) -
      scalarLoss(normalizedTheta - normalizedStep, normalizedX, normalizedY)) /
    (2 * normalizedStep);

  return {
    id: "m32-s05-scalar-reverse-mode-trace",
    inputs: { theta: normalizedTheta, x: normalizedX, y: normalizedY },
    step: normalizedStep,
    operations: [
      { node: "product", expression: "theta * x", value: product, localDerivative: "d(product)/d(theta) = x" },
      { node: "residual", expression: "product - y", value: residual, localDerivative: "d(residual)/d(product) = 1" },
      { node: "loss", expression: "residual^2", value: loss, localDerivative: "d(loss)/d(residual) = 2 * residual" },
    ],
    analyticGradient,
    centralDifferenceGradient,
    conclusion:
      "The manual chain rule and central difference concern one declared scalar program, point, and step. Their agreement makes this narrow arithmetic trace easier to inspect; it does not validate a framework graph, dtype/device path, data set, objective choice, optimizer, or model use.",
    truthBoundary,
  };
}
