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

function frozenJointRow(signal, context, probability) {
  return Object.freeze({ signal, context, probability });
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
    jointDistribution: Object.freeze([
      frozenJointRow(0, 0, 0.25),
      frozenJointRow(0, 1, 0.25),
      frozenJointRow(1, 0, 0.25),
      frozenJointRow(1, 1, 0.25),
    ]),
  }),
  "context-heavy": Object.freeze({
    id: "context-heavy",
    jointDistribution: Object.freeze([
      frozenJointRow(0, 0, 0.125),
      frozenJointRow(0, 1, 0.375),
      frozenJointRow(1, 0, 0.125),
      frozenJointRow(1, 1, 0.375),
    ]),
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

function frozenModelSelectionRow(id, partition, signal, context, label) {
  return Object.freeze({ id, partition, signal, context, label });
}

const modelSelectionRows = Object.freeze([
  frozenModelSelectionRow("train-1", "train", 0, 0, 0),
  frozenModelSelectionRow("train-2", "train", 1, 0, 0),
  frozenModelSelectionRow("train-3", "train", 0, 1, 1),
  frozenModelSelectionRow("train-4", "train", 1, 1, 1),
  frozenModelSelectionRow("validation-1", "validation", 0, 1, 1),
  frozenModelSelectionRow("validation-2", "validation", 1, 0, 0),
  frozenModelSelectionRow("fresh-1", "fresh-evaluation", 0, 1, 0),
  frozenModelSelectionRow("fresh-2", "fresh-evaluation", 1, 0, 1),
  frozenModelSelectionRow("fresh-3", "fresh-evaluation", 1, 1, 1),
  frozenModelSelectionRow("fresh-4", "fresh-evaluation", 0, 1, 0),
]);

export const M35_M36_SIGNAL_ROUTING_FIXTURE = Object.freeze({
  id: "m35-m36-fixed-signal-routing-v1",
  version: FIXTURE_VERSION,
  labelRule: "label = Number(signal === context)",
  rows: signalRoutingRows,
  namedRelations,
  calibrationObservations,
  finiteLearningSample,
  modelSelectionRows,
  localOnly: true,
  truthBoundary,
});

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function scoreBinaryThresholdCandidate(candidate, rows) {
  const observations = rows.map((row) => {
    const featureValue = row[candidate.feature];
    const prediction = candidate.polarity === 1 ? featureValue : 1 - featureValue;
    return {
      id: row.id,
      prediction,
      label: row.label,
      correct: prediction === row.label,
    };
  });
  const correct = observations.filter((observation) => observation.correct).length;
  return {
    candidateId: candidate.id,
    feature: candidate.feature,
    threshold: candidate.threshold,
    polarity: candidate.polarity,
    correct,
    total: observations.length,
    accuracy: correct / observations.length,
    observations,
  };
}

function fitBinaryThresholdCandidate(id, feature, rows) {
  const orientations = [1, -1].map((polarity) => ({
    id,
    feature,
    threshold: 0.5,
    polarity,
  }));
  const bestTrainingScore = orientations
    .map((candidate) => scoreBinaryThresholdCandidate(candidate, rows))
    .reduce((best, candidate) => (candidate.accuracy > best.accuracy ? candidate : best));

  return {
    id,
    feature,
    threshold: bestTrainingScore.threshold,
    polarity: bestTrainingScore.polarity,
    trainingCorrect: bestTrainingScore.correct,
    trainingTotal: bestTrainingScore.total,
    trainingAccuracy: bestTrainingScore.accuracy,
  };
}

function highestAccuracyScore(scores) {
  return scores.reduce((best, score) => (score.accuracy > best.accuracy ? score : best));
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

/**
 * Derive one binary cross-entropy comparison from a declared Bernoulli
 * conditional model. The numbers are exact, hand-checkable constants rather
 * than a fitted probability or calibration experiment.
 */
export function m35BernoulliLogLikelihoodCard() {
  const probability = 0.75;
  const logit = Math.log(probability / (1 - probability));

  return {
    id: "m35-s04-bernoulli-log-likelihood-card",
    logit,
    probability,
    conditionalModel: "P(Y = y | x) = p^y (1 - p)^(1-y), with y in {0, 1}",
    derivation: "negative log likelihood = -[y log p + (1-y) log(1-p)]",
    examples: [
      {
        label: 1,
        likelihood: probability,
        negativeLogLikelihood: Math.log(4 / 3),
      },
      {
        label: 0,
        likelihood: 1 - probability,
        negativeLogLikelihood: Math.log(4),
      },
    ],
    conclusion:
      "For this declared Bernoulli model, a probability assigned to the observed label receives a smaller negative log likelihood when it is larger. The loss is a consequence of the model assumption, not a generic proof that its target or probabilities are appropriate.",
    truthBoundary:
      "This card derives two losses from one fixed Bernoulli conditional model and probability. It is not a fitted model, a calibration guarantee, a proper-scoring-rule proof in a population, a framework test, a generalization result, or a decision rule.",
  };
}

/**
 * Make the effect of one L2 penalty visible in a one-parameter objective.
 * This is a constructed analytic card, not a tuning procedure or model run.
 */
export function m35RidgeShrinkageCard() {
  const target = 2;
  const alternatives = [0, 1, 3].map((lambda) => {
    const minimizer = target / (1 + lambda);
    const dataTerm = (minimizer - target) ** 2;
    const penaltyTerm = lambda * minimizer ** 2;
    return { lambda, minimizer, dataTerm, penaltyTerm, objectiveValue: dataTerm + penaltyTerm };
  });

  return {
    id: "m35-s04-ridge-shrinkage-card",
    objective: "J_lambda(w) = (w - 2)^2 + lambda w^2",
    derivative: "dJ_lambda/dw = 2(w - 2) + 2 lambda w",
    minimizer: "w_lambda^* = 2 / (1 + lambda)",
    alternatives,
    selectionBoundary:
      "A choice among lambda values consumes the labels and metric used for selection. Preserve that selection record and use a fresh evaluation relation for a later performance observation.",
    conclusion:
      "Increasing lambda changes the objective and shrinks this constructed optimum toward zero. Objective values across different lambda values answer different optimization questions, so they are not a model-ranking metric by themselves.",
    truthBoundary:
      "This one-parameter analytic card is not a fitted regression, a hyperparameter search, a model-selection result, a population-risk claim, or evidence that any lambda is appropriate for another task, split, representation, or use decision.",
  };
}

/**
 * Fit two tiny threshold candidates on a declared training partition, choose
 * between them only with validation rows, then expose a different fresh
 * finite partition. The intentionally shifted fresh rows make it possible to
 * inspect why looking at them to change the candidate is leakage.
 */
export function m35FitSelectFreshEvaluationTrace() {
  const trainRows = modelSelectionRows.filter((row) => row.partition === "train");
  const validationRows = modelSelectionRows.filter((row) => row.partition === "validation");
  const freshEvaluationRows = modelSelectionRows.filter(
    (row) => row.partition === "fresh-evaluation",
  );
  const declaredCandidates = [
    { id: "signal-threshold", feature: "signal" },
    { id: "context-threshold", feature: "context" },
  ];
  const fittedCandidates = declaredCandidates.map(({ id, feature }) =>
    fitBinaryThresholdCandidate(id, feature, trainRows),
  );
  const validationScores = fittedCandidates.map((candidate) =>
    scoreBinaryThresholdCandidate(candidate, validationRows),
  );
  const selectedValidationScore = highestAccuracyScore(validationScores);
  const selectedCandidate = fittedCandidates.find(
    (candidate) => candidate.id === selectedValidationScore.candidateId,
  );
  const selectedFreshScore = scoreBinaryThresholdCandidate(selectedCandidate, freshEvaluationRows);
  const improperlyCombinedScores = fittedCandidates.map((candidate) =>
    scoreBinaryThresholdCandidate(candidate, [...validationRows, ...freshEvaluationRows]),
  );
  const improperSelectionScore = highestAccuracyScore(improperlyCombinedScores);

  return {
    id: "m35-s03-s04-fit-select-fresh-evaluation-trace",
    partition: {
      trainRowIds: trainRows.map((row) => row.id),
      validationRowIds: validationRows.map((row) => row.id),
      freshEvaluationRowIds: freshEvaluationRows.map((row) => row.id),
    },
    fitting: {
      objective:
        "For each declared one-feature threshold family, choose the orientation with the highest training accuracy; an exact orientation tie keeps the declared positive orientation.",
      rowsUsed: trainRows.map((row) => row.id),
      candidateOrder: declaredCandidates.map(({ id }) => id),
      candidates: fittedCandidates.map((candidate) => ({ ...candidate })),
    },
    selection: {
      metric: "validation accuracy; declared candidate order breaks an exact score tie",
      rowsUsed: validationRows.map((row) => row.id),
      candidates: validationScores,
      selectedCandidateId: selectedValidationScore.candidateId,
    },
    freshEvaluation: {
      metric: "fresh finite accuracy for the already selected candidate only",
      rowsUsed: freshEvaluationRows.map((row) => row.id),
      selectedCandidateId: selectedFreshScore.candidateId,
      correct: selectedFreshScore.correct,
      total: selectedFreshScore.total,
      accuracy: selectedFreshScore.accuracy,
      observations: selectedFreshScore.observations,
    },
    oneChangeLeakageDebug: {
      changedPremise: "Allow fresh labels to participate in candidate selection.",
      improperlyUsedRows: freshEvaluationRows.map((row) => row.id),
      correctSelectionCandidateId: selectedValidationScore.candidateId,
      improperCandidateScores: improperlyCombinedScores,
      improperSelectedCandidateId: improperSelectionScore.candidateId,
      diagnosis:
        "Using fresh labels to choose the candidate turns fresh evaluation into selection-conditioned evidence, so it no longer supports an untouched fresh-evaluation claim.",
      repair:
        "Keep the validation-selected candidate and its selection record fixed; treat the fresh observation as evidence about the declared fresh rows, then predeclare a new independent evaluation before any further candidate choice.",
    },
    truthBoundary:
      "This deterministic synthetic split trace is not a population estimate, a stochastic training run, a generalization result, an architecture ranking, a calibration result, or a decision recommendation.",
  };
}

function fixedTwoReluCard(row) {
  const conjunctionUnit = Math.max(0, row.signal + row.context - 1);
  const bothZeroUnit = Math.max(0, 1 - row.signal - row.context);
  const score = conjunctionUnit + bothZeroUnit;
  return {
    id: row.id,
    input: { signal: row.signal, context: row.context },
    label: row.label,
    hidden: { conjunctionUnit, bothZeroUnit },
    score,
    prediction: Number(score > 0),
  };
}

/**
 * Compare hypothesis families that all begin with the same two declared raw
 * fields. This is a finite expressivity card, not a training comparison.
 */
export function m35SharedInformationModelFamilyCard() {
  const rows = signalRoutingRows.map((row) => {
    const fixedTwoRelu = fixedTwoReluCard(row);
    return {
      ...fixedTwoRelu,
      explicitInteraction: Number(row.signal === row.context),
    };
  });

  return {
    id: "m35-s02-shared-information-model-family-card",
    rawInputs: ["signal", "context"],
    trainingOrSelectionPerformed: false,
    families: [
      {
        id: "single-affine-threshold",
        form: "1[w0 + ws * signal + wc * context >= 0]",
        result: "cannot represent the declared equality labels on all four rows",
        proofIdea:
          "The required positive and negative affine inequalities sum to a contradiction on this four-row card.",
      },
      {
        id: "explicit-target-shaped-interaction",
        form: "1[signal == context] as a derived feature",
        result: "matches the disclosed synthetic label rule",
        caution:
          "The derived feature injects target-shaped structure; it is not a discovered representation or a generally appropriate feature.",
      },
      {
        id: "fixed-two-relu-network",
        form: "ReLU(signal + context - 1) + ReLU(1 - signal - context)",
        result: "matches the declared equality labels on this four-row card",
        caution:
          "Its parameters are constructed by hand; this is not evidence about training, selection, data efficiency, or architecture superiority.",
      },
    ],
    rows,
    conclusion:
      "With raw information held fixed, changing the hypothesis family or engineered representation can change what is expressible. That finite fact is not a benchmark or a rule for choosing an architecture.",
    truthBoundary,
  };
}

/**
 * Make one hand-checkable two-parameter-layer ReLU forward/backward trace
 * inspectable. The preactivation is strictly positive, so no ReLU-at-zero
 * derivative convention is invoked.
 */
export function m35M36FixedReluTrace() {
  const input = { x1: 1, x2: 0 };
  const parameters = { w1: 2, w2: -1, b1: -0.5, v: 3, b2: 0.2 };
  const target = 1;
  const preactivation = parameters.w1 * input.x1 + parameters.w2 * input.x2 + parameters.b1;
  const activation = Math.max(0, preactivation);
  const output = parameters.v * activation + parameters.b2;
  const loss = (output - target) ** 2;
  const dLossDOutput = 2 * (output - target);
  const dLossDV = dLossDOutput * activation;
  const dLossDActivation = dLossDOutput * parameters.v;
  const dLossDPreactivation = dLossDActivation;

  return {
    id: "m35-m36-fixed-two-layer-relu-trace",
    input,
    target,
    parameters,
    forward: { preactivation, activation, output, loss },
    backward: {
      dLossDOutput,
      dLossDV,
      dLossDB2: dLossDOutput,
      dLossDActivation,
      dLossDPreactivation,
      dLossDW1: dLossDPreactivation * input.x1,
      dLossDW2: dLossDPreactivation * input.x2,
      dLossDB1: dLossDPreactivation,
    },
    executionScope: "one scalar two-layer ReLU calculation in current ECMAScript Number arithmetic",
    truthBoundary:
      "This hand-checkable trace describes one fixed parameter setting and one example. It is not a framework/autodiff comparison, training result, generalization claim, calibration result, architecture ranking, or reliability decision.",
  };
}

function relationEvidence(id) {
  const relation = namedRelations[id];
  if (!relation) {
    throw new RangeError(`Unknown fixed signal-routing relation: ${id}.`);
  }
  const signalOneMass = relation.jointDistribution
    .filter((row) => row.signal === 1)
    .reduce((total, row) => total + row.probability, 0);
  const contextOneMass = relation.jointDistribution
    .filter((row) => row.context === 1)
    .reduce((total, row) => total + row.probability, 0);
  const signalOnlyExpectedAccuracy = relation.jointDistribution.reduce(
    (total, row) =>
      total + row.probability * Number(row.signal === Number(row.signal === row.context)),
    0,
  );
  return {
    relationId: relation.id,
    jointDistribution: relation.jointDistribution.map((row) => ({ ...row })),
    signalOneMass,
    contextOneMass,
    signalOnlyExpectedAccuracy,
    signalOnlyExpectedZeroOneRisk: 1 - signalOnlyExpectedAccuracy,
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
    relationScope:
      "The two named relations fully specify independent binary signal/context draws; the fixed signal-only predictor is correct exactly when context is 1.",
    conclusion:
      "The empirical risks describe this finite sample, while the two expected accuracies describe only two declared synthetic relations. Neither result supplies IID evidence, a uniform-deviation theorem, an efficient learner, or a deployment claim.",
    truthBoundary,
  };
}

/**
 * Keep one finite-class union-bound calculation concrete without pretending
 * its assumptions apply to the shared toy relation or a neural network.
 */
export function m36FiniteClassSampleBoundCard() {
  const assumptions = Object.freeze({ hypothesisCount: 8, epsilon: 0.25, delta: 0.05 });
  const rawSufficientSampleSize =
    Math.log((2 * assumptions.hypothesisCount) / assumptions.delta) /
    (2 * assumptions.epsilon ** 2);
  const sufficientSampleSize = Math.ceil(rawSufficientSampleSize);
  const failureBound = (sampleSize) =>
    2 * assumptions.hypothesisCount * Math.exp(-2 * sampleSize * assumptions.epsilon ** 2);

  return {
    id: "m36-s03-finite-class-sample-bound-card",
    assumptions,
    derivation: "n >= log(2K/delta) / (2 epsilon^2) for the stated finite-class union-bound route",
    rawSufficientSampleSize,
    sufficientSampleSize,
    failureBoundAtPreviousInteger: failureBound(sufficientSampleSize - 1),
    failureBoundAtSufficientSampleSize: failureBound(sufficientSampleSize),
    conclusion:
      "For exactly K=8, epsilon=0.25, and delta=0.05 under the displayed bounded-loss IID finite-class route, 47 is one sufficient integer sample size. It is a sufficient bound from this route, not an exact minimum or an empirical result.",
    truthBoundary:
      "This is one numerical substitution into a finite-class IID union-bound route. It is not evidence that samples are IID, a deep-network bound, an efficient learner, a data-quality guarantee, a calibrated probability claim, or a deployment decision.",
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
