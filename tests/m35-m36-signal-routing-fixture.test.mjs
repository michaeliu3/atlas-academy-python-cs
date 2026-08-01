import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  M35_M36_SIGNAL_ROUTING_FIXTURE,
  m35BaselineComparison,
  m35BernoulliLogLikelihoodCard,
  m35CalibrationContrast,
  m35M36FixedReluTrace,
  m35RepresentationCollisionWitness,
  m35RidgeShrinkageCard,
  m35SharedInformationModelFamilyCard,
  m35SquaredLossGradientCheck,
  m36FiniteClassSampleBoundCard,
  m36LearningClaimProbe,
  m36ReductionOrderProbe,
} from "../lib/m35-m36-signal-routing-fixture.js";

function assertApproximately(actual, expected, tolerance = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}.`,
  );
}

test("the shared fixture is frozen, local, and explicit about its evidence boundary", () => {
  assert.equal(M35_M36_SIGNAL_ROUTING_FIXTURE.id, "m35-m36-fixed-signal-routing-v1");
  assert.equal(M35_M36_SIGNAL_ROUTING_FIXTURE.localOnly, true);
  assert.equal(Object.isFrozen(M35_M36_SIGNAL_ROUTING_FIXTURE), true);
  assert.equal(Object.isFrozen(M35_M36_SIGNAL_ROUTING_FIXTURE.rows), true);
  assert.equal(M35_M36_SIGNAL_ROUTING_FIXTURE.rows.length, 4);
  assert.match(M35_M36_SIGNAL_ROUTING_FIXTURE.truthBoundary, /fully synthetic finite cards/u);
  assert.match(M35_M36_SIGNAL_ROUTING_FIXTURE.truthBoundary, /do not describe people/u);
});

test("the representation witness makes a collision and its narrow conclusion inspectable", () => {
  const witness = m35RepresentationCollisionWitness();

  assert.equal(witness.witnesses[0].representation, witness.witnesses[1].representation);
  assert.notEqual(witness.witnesses[0].label, witness.witnesses[1].label);
  assert.equal(witness.deterministicDownstreamCanSeparate, false);
  assert.match(witness.truthBoundary, /generalization theorem/u);
});

test("the baseline card retains each alternative's input budget beside its finite score", () => {
  const comparison = m35BaselineComparison();
  const byId = Object.fromEntries(comparison.alternatives.map((alternative) => [alternative.id, alternative]));

  assert.deepEqual(byId["constant-one"].inputFields, []);
  assert.deepEqual(byId["signal-only"].inputFields, ["signal"]);
  assert.deepEqual(byId["disclosed-rule"].inputFields, ["signal", "context"]);
  assert.equal(byId["constant-one"].accuracy, 0.5);
  assert.equal(byId["signal-only"].accuracy, 0.5);
  assert.equal(byId["disclosed-rule"].accuracy, 1);
  assert.match(comparison.conclusion, /different information budgets/u);
});

test("the calibration contrast holds threshold accuracy fixed while exposing finite probability differences", () => {
  const contrast = m35CalibrationContrast();
  const byId = Object.fromEntries(contrast.predictors.map((predictor) => [predictor.id, predictor]));

  assert.equal(byId["calibrated-card"].accuracy, 0.75);
  assert.equal(byId["overconfident-card"].accuracy, 0.75);
  assertApproximately(byId["calibrated-card"].brierScore, 0.1875);
  assertApproximately(byId["overconfident-card"].brierScore, 0.2451);
  assert.ok(byId["calibrated-card"].brierScore < byId["overconfident-card"].brierScore);
  assert.deepEqual(byId["calibrated-card"].bins, [
    { probability: 0.25, count: 4, positiveCount: 1, observedPositiveRate: 0.25 },
    { probability: 0.75, count: 4, positiveCount: 3, observedPositiveRate: 0.75 },
  ]);
  assert.match(contrast.conclusion, /population calibration guarantee/u);
});

test("the bounded gradient check agrees at one point and rejects invalid numerical inputs", () => {
  const check = m35SquaredLossGradientCheck({ weight: 0, feature: 2, label: 1 });

  assert.equal(check.loss, 1);
  assert.equal(check.analyticGradient, -4);
  assertApproximately(check.centralDifferenceGradient, -4, 1e-8);
  assert.match(check.truthBoundary, /one displayed scalar loss/u);
  assert.throws(
    () => m35SquaredLossGradientCheck({ weight: Number.NaN, feature: 2, label: 1 }),
    /weight must be a finite number/u,
  );
  assert.throws(
    () => m35SquaredLossGradientCheck({ weight: 0, feature: 2, label: 1, step: 0 }),
    /step must be positive/u,
  );
});

test("the M35 likelihood card derives a scoped binary cross-entropy comparison", () => {
  const card = m35BernoulliLogLikelihoodCard();

  assert.equal(card.logit, Math.log(3));
  assert.equal(card.probability, 0.75);
  assert.deepEqual(
    card.examples.map(({ label, negativeLogLikelihood }) => [label, negativeLogLikelihood]),
    [
      [1, Math.log(4 / 3)],
      [0, Math.log(4)],
    ],
  );
  assert.match(card.derivation, /-\[y log p \+ \(1-y\) log\(1-p\)\]/u);
  assert.match(card.truthBoundary, /calibration guarantee/u);
});

test("the M35 ridge card keeps objective shrinkage and selection evidence distinct", () => {
  const card = m35RidgeShrinkageCard();

  assert.equal(card.objective, "J_lambda(w) = (w - 2)^2 + lambda w^2");
  assert.equal(card.minimizer, "w_lambda^* = 2 / (1 + lambda)");
  assert.deepEqual(card.alternatives, [
    { lambda: 0, minimizer: 2, dataTerm: 0, penaltyTerm: 0, objectiveValue: 0 },
    { lambda: 1, minimizer: 1, dataTerm: 1, penaltyTerm: 1, objectiveValue: 2 },
    { lambda: 3, minimizer: 0.5, dataTerm: 2.25, penaltyTerm: 0.75, objectiveValue: 3 },
  ]);
  assert.match(card.selectionBoundary, /fresh evaluation relation/u);
  assert.match(card.truthBoundary, /model-selection result/u);
});

test("the shared-information card separates raw inputs, hypothesis families, and constructed scope", () => {
  const card = m35SharedInformationModelFamilyCard();
  const byFamily = Object.fromEntries(card.families.map((family) => [family.id, family]));

  assert.deepEqual(card.rawInputs, ["signal", "context"]);
  assert.equal(card.trainingOrSelectionPerformed, false);
  assert.match(byFamily["single-affine-threshold"].result, /cannot represent/u);
  assert.match(byFamily["fixed-two-relu-network"].caution, /constructed by hand/u);
  assert.deepEqual(
    card.rows.map((row) => row.prediction),
    [1, 0, 0, 1],
  );
  assert.deepEqual(
    card.rows.map((row) => row.explicitInteraction),
    [1, 0, 0, 1],
  );
  assert.match(card.conclusion, /raw information held fixed/u);
  assert.match(card.truthBoundary, /generalization theorem/u);
});

test("the fixed two-layer trace exposes forward values and a scoped backward path", () => {
  const trace = m35M36FixedReluTrace();

  assert.deepEqual(trace.input, { x1: 1, x2: 0 });
  assert.equal(trace.forward.preactivation, 1.5);
  assert.equal(trace.forward.activation, 1.5);
  assert.equal(trace.forward.output, 4.7);
  assertApproximately(trace.forward.loss, 13.69);
  assert.equal(trace.backward.dLossDOutput, 7.4);
  assertApproximately(trace.backward.dLossDPreactivation, 22.2);
  assertApproximately(trace.backward.dLossDW1, 22.2);
  assert.equal(trace.backward.dLossDW2, 0);
  assert.match(trace.executionScope, /two-layer ReLU/u);
  assert.match(trace.truthBoundary, /not a framework\/autodiff comparison/u);
});

test("the M36 card keeps finite empirical risk and a named synthetic shift distinct", () => {
  const probe = m36LearningClaimProbe();
  const byHypothesis = Object.fromEntries(
    probe.hypotheses.map((hypothesis) => [hypothesis.id, hypothesis]),
  );
  const byRelation = Object.fromEntries(
    probe.namedRelationContrast.map((relation) => [relation.relationId, relation]),
  );

  assert.equal(byHypothesis["always-zero"].empiricalZeroOneRisk, 0.75);
  assert.equal(byHypothesis["always-one"].empiricalZeroOneRisk, 0.25);
  assert.equal(byRelation["source-balanced"].signalOnlyExpectedAccuracy, 0.5);
  assert.equal(byRelation["context-heavy"].signalOnlyExpectedAccuracy, 0.75);
  assert.deepEqual(byRelation["source-balanced"].jointDistribution, [
    { signal: 0, context: 0, probability: 0.25 },
    { signal: 0, context: 1, probability: 0.25 },
    { signal: 1, context: 0, probability: 0.25 },
    { signal: 1, context: 1, probability: 0.25 },
  ]);
  assert.deepEqual(byRelation["context-heavy"].jointDistribution, [
    { signal: 0, context: 0, probability: 0.125 },
    { signal: 0, context: 1, probability: 0.375 },
    { signal: 1, context: 0, probability: 0.125 },
    { signal: 1, context: 1, probability: 0.375 },
  ]);
  assert.equal(
    probe.relationScope,
    "The two named relations fully specify independent binary signal/context draws; the fixed signal-only predictor is correct exactly when context is 1.",
  );
  assert.match(probe.conclusion, /Neither result supplies IID evidence/u);
  assert.match(probe.truthBoundary, /generalization theorem/u);
});

test("the M36 finite-class card checks one union-bound sample-size calculation and its limit", () => {
  const card = m36FiniteClassSampleBoundCard();

  assert.deepEqual(card.assumptions, { hypothesisCount: 8, epsilon: 0.25, delta: 0.05 });
  assert.equal(card.sufficientSampleSize, 47);
  assert.ok(card.failureBoundAtPreviousInteger > card.assumptions.delta);
  assert.ok(card.failureBoundAtSufficientSampleSize <= card.assumptions.delta);
  assert.match(card.derivation, /log\(2K\/delta\) \/ \(2 epsilon\^2\)/u);
  assert.match(card.truthBoundary, /deep-network bound/u);
});

test("the reduction-order probe reports only its current JavaScript numerical scope", () => {
  const probe = m36ReductionOrderProbe();

  assert.equal(probe.left, 1);
  assert.equal(probe.right, 0);
  assert.equal(probe.valuesDiffer, true);
  assert.equal(probe.executionScope, "current ECMAScript Number evaluation only");
  assert.match(probe.truthBoundary, /not a failure of real-number algebra/u);
  assert.match(probe.truthBoundary, /not a .*cross-platform reproducibility claim/u);
});

test("each probe is deterministic and does not mutate the shared declaration", () => {
  const first = {
    collision: m35RepresentationCollisionWitness(),
    baseline: m35BaselineComparison(),
    calibration: m35CalibrationContrast(),
    modelFamily: m35SharedInformationModelFamilyCard(),
    twoLayerTrace: m35M36FixedReluTrace(),
    learning: m36LearningClaimProbe(),
    reduction: m36ReductionOrderProbe(),
  };
  const second = {
    collision: m35RepresentationCollisionWitness(),
    baseline: m35BaselineComparison(),
    calibration: m35CalibrationContrast(),
    modelFamily: m35SharedInformationModelFamilyCard(),
    twoLayerTrace: m35M36FixedReluTrace(),
    learning: m36LearningClaimProbe(),
    reduction: m36ReductionOrderProbe(),
  };

  assert.deepEqual(second, first);
  assert.equal(M35_M36_SIGNAL_ROUTING_FIXTURE.rows[0].label, 1);
  assert.equal(M35_M36_SIGNAL_ROUTING_FIXTURE.calibrationObservations[0].label, 1);
});

test("the M35 and M36 workbooks turn the shared fixture into bounded prediction work", async () => {
  const [m35Workbook, m36Workbook] = await Promise.all([
    readFile("content/authoring/m35_machine_learning_representation_workbook.v1.md", "utf8"),
    readFile("content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md", "utf8"),
  ]);

  assert.match(m35Workbook, /m35RepresentationCollisionWitness\(\)/u);
  assert.doesNotMatch(m35Workbook, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u);
  assert.match(m35Workbook, /m35BaselineComparison\(\)/u);
  assert.match(m35Workbook, /m35CalibrationContrast\(\)/u);
  assert.match(m35Workbook, /m35SquaredLossGradientCheck\(\{ weight: 0, feature: 2, label: 1 \}\)/u);
  assert.match(m35Workbook, /m35BernoulliLogLikelihoodCard\(\)/u);
  assert.match(m35Workbook, /Bernoulli likelihood — why this loss has this shape/u);
  assert.ok(m35Workbook.includes("\\Pr(Y=y\\mid \\phi(x))"));
  assert.match(m35Workbook, /m35RidgeShrinkageCard\(\)/u);
  assert.match(m35Workbook, /Regularization changes the target; selection changes the evidence/u);
  assert.match(m35Workbook, /m35SharedInformationModelFamilyCard\(\)/u);
  assert.match(m35Workbook, /m35M36FixedReluTrace\(\)/u);
  assert.match(m35Workbook, /Selection boundary — inspection changes the evidence/u);
  assert.match(m35Workbook, /Claim\/source trail/u);
  assert.match(m35Workbook, /Split contract — name the relation before naming a tool/u);
  assert.ok(m35Workbook.includes("Brier scores are"));
  assert.ok(m35Workbook.includes("0.1875"));
  assert.ok(m35Workbook.includes("0.2451"));
  assert.match(m35Workbook, /two-hidden-unit ReLU/u);
  assert.match(m36Workbook, /m36LearningClaimProbe\(\)/u);
  assert.doesNotMatch(m36Workbook, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u);
  assert.match(m36Workbook, /m36FiniteClassSampleBoundCard\(\)/u);
  assert.match(m36Workbook, /One numerical theorem card — calculation is not a deployment claim/u);
  assert.ok(m36Workbook.includes("\\varepsilon=0.25"));
  assert.ok(m36Workbook.includes("Name \\(P\\) fully before calculating"));
  assert.match(m36Workbook, /Fix the candidate protocol before reading a theorem as evaluation evidence/u);
  assert.match(m36Workbook, /m36ReductionOrderProbe\(\)/u);
  assert.match(m36Workbook, /m35CalibrationContrast\(\)/u);
  assert.match(
    m36Workbook,
    /score values for which the conditional relation is\s+defined/u,
  );
  assert.ok(m36Workbook.includes("\\mathbb{E}[Y\\mid q(X)]=q(X)"));
  assert.match(m36Workbook, /m35M36FixedReluTrace\(\)/u);
  assert.match(m36Workbook, /Finite-class proof skeleton — the union-bound step has a home/u);
  assert.match(m36Workbook, /Hoeffding's inequality gives/u);
  assert.match(m36Workbook, /Quantifier card — uniform deviation is not yet PAC learnability/u);
  assert.match(m36Workbook, /Bartlett–Foster–Telgarsky spectral-normalized margin-bound example/u);
  assert.ok(m36Workbook.includes("2K e^{-2n\\varepsilon^2}"));
  assert.match(m36Workbook, /input-mixture \/ covariate shift/u);
  assert.match(m36Workbook, /conditional \/ label-relation shift/u);
  assert.match(m36Workbook, /not IID evidence, a PAC\/VC calculation/u);
});
