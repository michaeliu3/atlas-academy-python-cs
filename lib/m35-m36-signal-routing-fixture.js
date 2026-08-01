/**
 * Small, deterministic reasoning fixtures shared by M35 and M36.
 *
 * These functions model only a declared four-bit synthetic setting and a few
 * hand-checkable numerical cards. They do not load data, train a framework
 * model, call a service, persist learner work, or support arbitrary code.
 */

const FIXTURE_VERSION = "atlas-m35-m36-signal-routing-fixture/1";

const truthBoundary =
  "These local, fully synthetic finite cards do not describe people, a real population, a trained model, framework behavior, a benchmark, population calibration, a generalization theorem, robustness to every shift, or permission to make a decision.";

function frozenRow(id, signal, context) {
  return Object.freeze({
    id,
    signal,
    context,
    label: Number(signal === context),
  });
}

const signalRoutingRows = Object.freeze([
  frozenRow("00", 0, 0),
  frozenRow("01", 0, 1),
  frozenRow("10", 1, 0),
  frozenRow("11", 1, 1),
]);

const namedRelations = Object.freeze({
  "source-balanced": Object.freeze({
    id: "source-balanced",
    signalOneMass: 0.5,
    contextOneMass: 0.5,
  }),
  "context-heavy": Object.freeze({
    id: "context-heavy",
    signalOneMass: 0.5,
    contextOneMass: 0.75,
  }),
});

const calibrationObservations = Object.freeze([
  Object.freeze({ id: "c1", label: 1, calibratedProbability: 0.75, overconfidentProbability: 0.99 }),
  Object.freeze({ id: "c2", label: 1, calibratedProbability: 0.75, overconfidentProbability: 0.99 }),
  Object.freeze({ id: "c3", label: 1, calibratedProbability: 0.75, overconfidentProbability: 0.99 }),
  Object.freeze({ id: "c4", label: 0, calibratedProbability: 0.75, overconfidentProbability: 0.99 }),
  Object.freeze({ id: "c5", label: 1, calibratedProbability: 0.25, overconfidentProbability: 0.01 }),
  Object.freeze({ id: "c6", label: 0, calibratedProbability: 0.25, overconfidentProbability: 0.01 }),
  Object.freeze({ id: "c7", label: 0, calibratedProbability: 0.25, overconfidentProbability: 0.01 }),
  Object.freeze({ id: "c8", label: 0, calibratedProbability: 0.25, overconfidentProbability: 0.01 }),
]);

const finiteLearningSample = Object.freeze([
  Object.freeze({ id: "s1", label: 1 }),
  Object.freeze({ id: "s2", label: 1 }),
  Object.freeze({ id: "s3", label: 1 }),
  Object.freeze({ id: "s4", label: 0 }),
]);

export const M35_M36_SIGNAL_ROUTING_FIXTURE = Object.freeze({
  id: "m35-m36-fixed-signal-routing-v1",
  version: FIXTURE_VERSION,
  labelRule: "label = Number(signal === context)",
  rows: signalRoutingRows,
  namedRelations,
  calibrationObservations,
  finiteLearningSample,
  localOnly: true,
  truthBoundary,
});

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function finiteNumber(value, label) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number.`);
  }
  return value;
}

function probabilityCard(id, field) {
  const threshold = 0.5;
  const bins = new Map();
  let correct = 0;
  let squaredError = 0;

  for (const row of calibrationObservations) {
    const probability = row[field];
    const prediction = Number(probability >= threshold);
    correct += Number(prediction === row.label);
    squaredError += (probability - row.label) ** 2;
    const bin = bins.get(probability) ?? { probability, count: 0, positiveCount: 0 };
    bin.count += 1;
    bin.positiveCount += row.label;
    bins.set(probability, bin);
  }

  return {
    id,
    threshold,
    accuracy: correct / calibrationObservations.length,
    brierScore: squaredError / calibrationObservations.length,
    bins: [...bins.values()]
      .sort((left, right) => left.probability - right.probability)
      .map((bin) => ({
        ...bin,
        observedPositiveRate: bin.positiveCount / bin.count,
      })),
  };
}

/**
 * Show a task-relevant collision after phi(signal, context) = signal.
 */
export function m35RepresentationCollisionWitness() {
  const first = signalRoutingRows[0];
  const second = signalRoutingRows[1];
  return {
    id: "m35-s01-signal-only-representation-collision",
    representation: "phi(signal, context) = signal",
    witnesses: [
      { input: { signal: first.signal, context: first.context }, representation: first.signal, label: first.label },
      { input: { signal: second.signal, context: second.context }, representation: second.signal, label: second.label },
    ],
    deterministicDownstreamCanSeparate: false,
    conclusion:
      "The two declared inputs collide after phi while requiring different labels, so no deterministic downstream function of that representation can separate this pair for this declared task.",
    truthBoundary,
  };
}

function predictionForAlternative(id, row) {
  switch (id) {
    case "constant-one":
      return 1;
    case "signal-only":
      return row.signal;
    case "disclosed-rule":
      return Number(row.signal === row.context);
    default:
      throw new RangeError(`Unknown fixed signal-routing alternative: ${id}.`);
  }
}

/**
 * Compare three fixed alternatives on the same four declared rows. The rule
 * sees the label generator by design; that makes it a transparent oracle, not
 * a production baseline recommendation.
 */
export function m35BaselineComparison() {
  const alternatives = [
    { id: "constant-one", inputFields: [], role: "dummy lower bound" },
    { id: "signal-only", inputFields: ["signal"], role: "mismatched-information contrast" },
    { id: "disclosed-rule", inputFields: ["signal", "context"], role: "synthetic generator oracle" },
  ].map((alternative) => {
    const correct = signalRoutingRows.filter(
      (row) => predictionForAlternative(alternative.id, row) === row.label,
    ).length;
    return {
      ...alternative,
      correct,
      total: signalRoutingRows.length,
      accuracy: correct / signalRoutingRows.length,
    };
  });

  return {
    id: "m35-s02-fixed-baseline-comparison",
    rows: cloneRows(signalRoutingRows),
    alternatives,
    conclusion:
      "These scores are comparable only as a transparent fixed card. The alternatives have different information budgets, so a score difference is not architecture superiority.",
    truthBoundary,
  };
}

/**
 * Keep threshold accuracy fixed while exposing different finite probability
 * behavior and binned observed frequencies.
 */
export function m35CalibrationContrast() {
  return {
    id: "m35-s03-fixed-calibration-contrast",
    observations: cloneRows(calibrationObservations),
    predictors: [
      probabilityCard("calibrated-card", "calibratedProbability"),
      probabilityCard("overconfident-card", "overconfidentProbability"),
    ],
    conclusion:
      "Equal threshold accuracy can hide different probability behavior. Finite bin agreement in this card is not a population calibration guarantee or a decision rule.",
    truthBoundary,
  };
}

function squaredLoss(weight, feature, label) {
  return (weight * feature - label) ** 2;
}

/**
 * Evaluate the exact squared-loss code-reading example against one bounded
 * central-difference comparison. It is not an autodiff or framework check.
 */
export function m35SquaredLossGradientCheck({ weight, feature, label, step = 1e-5 }) {
  finiteNumber(weight, "weight");
  finiteNumber(feature, "feature");
  finiteNumber(label, "label");
  finiteNumber(step, "step");
  if (step <= 0) {
    throw new RangeError("step must be positive.");
  }

  const loss = squaredLoss(weight, feature, label);
  const analyticGradient = 2 * feature * (weight * feature - label);
  const centralDifferenceGradient =
    (squaredLoss(weight + step, feature, label) - squaredLoss(weight - step, feature, label)) /
    (2 * step);

  return {
    id: "m35-s04-squared-loss-gradient-check",
    point: { weight, feature, label },
    step,
    loss,
    analyticGradient,
    centralDifferenceGradient,
    truthBoundary:
      "This comparison checks one displayed scalar loss at one finite point and step. Agreement does not validate a data set, representation, objective, framework graph, optimizer, population claim, or use decision.",
  };
}

function relationEvidence(id) {
  const relation = namedRelations[id];
  if (!relation) {
    throw new RangeError(`Unknown fixed signal-routing relation: ${id}.`);
  }
  return {
    relationId: relation.id,
    signalOneMass: relation.signalOneMass,
    contextOneMass: relation.contextOneMass,
    signalOnlyExpectedAccuracy: relation.contextOneMass,
    signalOnlyExpectedZeroOneRisk: 1 - relation.contextOneMass,
  };
}

/**
 * Separate finite empirical observations from a declared relation contrast.
 * The only hypothesis class here is {always-zero, always-one}; it is a card
 * for reading scope, not a PAC/VC calculation or a learning algorithm.
 */
export function m36LearningClaimProbe() {
  const sampleSize = finiteLearningSample.length;
  const positives = finiteLearningSample.reduce((total, row) => total + row.label, 0);
  return {
    id: "m36-finite-risk-capacity-shift-probe",
    finiteSample: cloneRows(finiteLearningSample),
    hypotheses: [
      {
        id: "always-zero",
        empiricalZeroOneRisk: positives / sampleSize,
      },
      {
        id: "always-one",
        empiricalZeroOneRisk: 1 - positives / sampleSize,
      },
    ],
    namedRelationContrast: [
      relationEvidence("source-balanced"),
      relationEvidence("context-heavy"),
    ],
    conclusion:
      "The empirical risks describe this finite sample, while the two expected accuracies describe only two declared synthetic relations. Neither result supplies IID evidence, a uniform-deviation theorem, an efficient learner, or a deployment claim.",
    truthBoundary,
  };
}

/**
 * Make one floating-point reduction-order counterexample inspectable in the
 * current ECMAScript Number runtime without asserting cross-platform identity.
 */
export function m36ReductionOrderProbe() {
  const left = (1e16 + -1e16) + 1.0;
  const right = 1e16 + (-1e16 + 1.0);
  return {
    id: "m36-s04-ecmascript-number-reduction-order-probe",
    expressionLeft: "(1e16 + -1e16) + 1.0",
    expressionRight: "1e16 + (-1e16 + 1.0)",
    left,
    right,
    valuesDiffer: left !== right,
    executionScope: "current ECMAScript Number evaluation only",
    truthBoundary:
      "This is a finite floating-point representation observation in the current ECMAScript Number runtime. It is not a failure of real-number algebra, an IEEE-754 conformance suite, a framework measurement, or a cross-platform reproducibility claim.",
  };
}
