import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";
import {
  M35_M36_SIGNAL_ROUTING_FIXTURE,
  m35BaselineComparison,
  m35BernoulliLogLikelihoodCard,
  m35CalibrationContrast,
  m35DeclaredRelationShiftProbe,
  m35FitSelectFreshEvaluationTrace,
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
  assert.equal(
    M35_M36_SIGNAL_ROUTING_FIXTURE.modelSelectionRelation.trainAndValidationLabelRule,
    "label = context",
  );
  assert.equal(
    M35_M36_SIGNAL_ROUTING_FIXTURE.modelSelectionRelation.freshEvaluationLabelRule,
    "label = signal",
  );
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

test("the M35 trace fits on train rows, selects on validation rows, and preserves a fresh evaluation boundary", () => {
  const trace = m35FitSelectFreshEvaluationTrace();

  assert.deepEqual(trace.partition, {
    trainRowIds: ["train-1", "train-2", "train-3", "train-4"],
    validationRowIds: ["validation-1", "validation-2"],
    freshEvaluationRowIds: ["fresh-1", "fresh-2", "fresh-3", "fresh-4"],
  });
  assert.deepEqual(trace.fitting.rowsUsed, trace.partition.trainRowIds);
  assert.deepEqual(trace.selection.rowsUsed, trace.partition.validationRowIds);
  assert.deepEqual(trace.freshEvaluation.rowsUsed, trace.partition.freshEvaluationRowIds);
  assert.equal(trace.dataRelation.trainAndValidationLabelRule, "label = context");
  assert.equal(trace.dataRelation.freshEvaluationLabelRule, "label = signal");
  assert.match(trace.dataRelation.scope, /separate constructed selection-evidence fixture/u);
  assert.deepEqual(
    trace.fitting.candidates.map(({ id, polarity, trainingCorrect, trainingTotal }) => ({
      id,
      polarity,
      trainingCorrect,
      trainingTotal,
    })),
    [
      { id: "signal-threshold", polarity: 1, trainingCorrect: 2, trainingTotal: 4 },
      { id: "context-threshold", polarity: 1, trainingCorrect: 4, trainingTotal: 4 },
    ],
  );
  assert.deepEqual(
    trace.selection.candidates.flatMap(({ observations }) => observations.map(({ id }) => id)),
    ["validation-1", "validation-2", "validation-1", "validation-2"],
  );
  assert.deepEqual(
    trace.freshEvaluation.observations.map(({ id }) => id),
    ["fresh-1", "fresh-2", "fresh-3", "fresh-4"],
  );
  const evidencePartitions = [
    trace.fitting.rowsUsed,
    trace.selection.rowsUsed,
    trace.freshEvaluation.rowsUsed,
  ];
  assert.equal(new Set(evidencePartitions.flat()).size, evidencePartitions.flat().length);
  assert.equal(trace.selection.selectedCandidateId, "context-threshold");
  assert.equal(trace.freshEvaluation.selectedCandidateId, "context-threshold");
  assert.equal(trace.freshEvaluation.accuracy, 0.25);
  assert.equal(trace.oneChangeLeakageDebug.correctSelectionCandidateId, "context-threshold");
  assert.equal(trace.oneChangeLeakageDebug.improperSelectedCandidateId, "signal-threshold");
  assert.match(trace.oneChangeLeakageDebug.diagnosis, /fresh labels/u);
  assert.match(trace.truthBoundary, /not a population estimate/u);
});

test("the M35 shift probe makes its fixed relation and expected-accuracy change explicit", () => {
  const probe = m35DeclaredRelationShiftProbe();

  assert.equal(probe.fixedPredictor, "signal-only: prediction = signal");
  assert.equal(probe.fixedLabelRelation, "label = Number(signal === context)");
  assert.equal(probe.source.relationId, "source-balanced");
  assert.equal(probe.shifted.relationId, "context-heavy");
  assert.equal(probe.source.signalOnlyExpectedAccuracy, 0.5);
  assert.equal(probe.shifted.signalOnlyExpectedAccuracy, 0.75);
  assert.match(probe.changedPremise, /input mixture changes/u);
  assert.match(probe.truthBoundary, /not a sampled evaluation/u);
  assert.match(probe.truthBoundary, /not a robustness result/u);
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
  const [m35Workbook, m36Workbook, m35Candidate, m36Candidate] = await Promise.all([
    readFile("content/authoring/m35_machine_learning_representation_workbook.v1.md", "utf8").then((markdown) =>
      markdown.replace(/\r\n?/gu, "\n"),
    ),
    readFile("content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md", "utf8").then((markdown) =>
      markdown.replace(/\r\n?/gu, "\n"),
    ),
    readFile("content/modules/35_machine_learning_representation.md", "utf8").then((markdown) =>
      markdown.replace(/\r\n?/gu, "\n"),
    ),
    readFile("content/modules/36_statistical_learning_theory_reliable_deep_learning.md", "utf8").then((markdown) =>
      markdown.replace(/\r\n?/gu, "\n"),
    ),
  ]);

  assert.match(m35Workbook, /m35RepresentationCollisionWitness\(\)/u);
  assert.match(
    m35Workbook,
    /\[`lib\/m35-m36-signal-routing-fixture\.js`\]\(\.\.\/\.\.\/lib\/m35-m36-signal-routing-fixture\.js\)/u,
  );
  assert.match(
    m35Candidate,
    /\[`lib\/m35-m36-signal-routing-fixture\.js`\]\(\.\.\/\.\.\/lib\/m35-m36-signal-routing-fixture\.js\)/u,
  );
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
  assert.match(m35Workbook, /m35FitSelectFreshEvaluationTrace\(\)/u);
  assert.match(m35Workbook, /m35DeclaredRelationShiftProbe\(\)/u);
  assert.match(m35Workbook, /expected accuracy\s+changes from `0\.50` to `0\.75`/u);
  assert.match(m35Workbook, /separate constructed selection-evidence ledger/u);
  assert.match(m35Workbook, /declared train\/validation relation is `label = context`/u);
  assert.match(m35Workbook, /Fit → select → fresh evaluation/u);
  assert.match(m35Workbook, /One-change debugging probe — fresh labels are not tuning feedback/u);
  assert.match(m35Workbook, /training rows only/u);
  assert.match(m35Workbook, /m35M36FixedReluTrace\(\)/u);
  assert.match(m35Workbook, /Selection boundary — inspection changes the evidence/u);
  assert.match(m35Workbook, /Claim\/source trail/u);
  assert.match(m35Workbook, /S35-05–S35-08`, `S35-20–S35-24/u);
  assert.match(m35Workbook, /CMU 10-315 Chapter 1/u);
  assert.match(m35Workbook, /MIT 6\.7960 Lecture 17: Out-of-Distribution Generalization/u);
  const sessionTwoStart = m35Workbook.indexOf("## Session 2 —");
  const sessionThreeStart = m35Workbook.indexOf("## Session 3 —");
  const sessionFourStart = m35Workbook.indexOf("## Session 4 —");
  const sessionFiveStart = m35Workbook.indexOf("## Session 5 —");
  assert.ok(sessionTwoStart >= 0 && sessionThreeStart > sessionTwoStart);
  assert.ok(sessionFourStart > sessionThreeStart && sessionFiveStart > sessionFourStart);
  for (const [start, end] of [
    [sessionTwoStart, sessionThreeStart],
    [sessionThreeStart, sessionFourStart],
    [sessionFourStart, sessionFiveStart],
  ]) {
    assert.match(
      m35Workbook.slice(start, end),
      /### Retrieval and transfer/u,
      "M35 Sessions 2–4 should each close with a compact retrieval/transfer prompt.",
    );
  }
  assert.match(m35Workbook, /Split contract — name the relation before naming a tool/u);
  assert.ok(m35Workbook.includes("Brier scores are"));
  assert.ok(m35Workbook.includes("0.1875"));
  assert.ok(m35Workbook.includes("0.2451"));
  assert.match(m35Workbook, /two-hidden-unit ReLU/u);
  const m35SessionSixStart = m35Workbook.indexOf(
    "## Session 6 — Responsible ML representation dossier and oral defense",
  );
  const m35CandidateSessionSixStart = m35Candidate.indexOf(
    "## Session 6 — Responsible ML representation dossier and oral defense",
  );
  assert.ok(m35SessionSixStart >= 0, "M35 authoring pack needs its final dossier session.");
  assert.ok(m35CandidateSessionSixStart >= 0, "M35 candidate needs its final dossier session.");
  for (const [label, sessionSix] of [
    ["authoring pack", m35Workbook.slice(m35SessionSixStart)],
    ["frozen candidate", m35Candidate.slice(m35CandidateSessionSixStart)],
  ]) {
    assert.match(sessionSix, /### Dossier preflight — predict, inspect, repair/u, label);
    assert.match(sessionSix, /Synthetic AI-generated claim/u, label);
    assert.match(sessionSix, /Reveal after writing your prediction\./u, label);
    assert.match(sessionSix, /fresh-evaluation rows were used to choose the threshold/u, label);
    assert.match(sessionSix, /withdraw/u, label);
  }
  assert.match(m36Workbook, /m36LearningClaimProbe\(\)/u);
  assert.match(
    m36Workbook,
    /\[`lib\/m35-m36-signal-routing-fixture\.js`\]\(\.\.\/\.\.\/lib\/m35-m36-signal-routing-fixture\.js\)/u,
  );
  assert.match(
    m36Candidate,
    /\[`lib\/m35-m36-signal-routing-fixture\.js`\]\(\.\.\/\.\.\/lib\/m35-m36-signal-routing-fixture\.js\)/u,
  );
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
  assert.ok(m36Workbook.includes("\\exists A\\;\\forall\\varepsilon,\\delta\\in(0,1)"));
  assert.ok(
    m36Workbook.includes("\\forall m\\ge m_{\\mathcal H}(\\varepsilon,\\delta)"),
    "The PAC card must state its sample-complexity threshold for every sufficient sample count.",
  );
  assert.ok(m36Workbook.includes("\\Pr_{X_{1:m}\\sim D^m,\\,\\rho_A}"));
  assert.match(m36Workbook, /but\s+not on the later universally\s+quantified/u);
  assert.ok(m36Workbook.includes("\\(D\\) or\n\\(c\\)"));
  assert.match(m36Workbook, /Computational\s+efficiency is an additional claim/u);
  assert.match(m36Workbook, /Bartlett–Foster–Telgarsky spectrally-normalized margin-bound paper/u);
  assert.ok(m36Workbook.includes("2K e^{-2n\\varepsilon^2}"));
  assert.match(m36Workbook, /input-mixture \/ covariate shift/u);
  assert.match(m36Workbook, /conditional \/ label-relation shift/u);
  assert.match(m36Workbook, /S36-14–S36-19/u);
  assert.match(m36Workbook, /S36-07–S36-12`, `S36-20/u);
  assert.match(m36Workbook, /Carry the M35 evidence packet into the theorem card/u);
  assert.match(m36Workbook, /candidate-generation, selection, and stopping protocol/u);
  assert.match(m36Workbook, /Filled bounded record — one observed numerical factor/u);
  assert.match(m36Workbook, /factor actually changed/u);
  assert.match(m36Workbook, /deliberately unobserved/u);
  assert.match(m36Workbook, /reduction\/association order/u);
  assert.match(m36Workbook, /adversarial perturbation threat model/u);
  const threatCardStart = m36Workbook.indexOf("### Bounded adversarial threat card — declare the set");
  const calibrationStart = m36Workbook.indexOf("### Calibration and action remain distinct");
  assert.ok(threatCardStart >= 0 && calibrationStart > threatCardStart);
  const threatCard = m36Workbook.slice(threatCardStart, calibrationStart);
  assert.ok(threatCard.includes("\\mathcal A_1"));
  assert.ok(threatCard.includes("\\(x=(s,c)\\in\\{0,1\\}^2\\)"));
  assert.ok(threatCard.includes("\\(x'\\in\\mathcal A_1(x)\\)"));
  assert.ok(threatCard.includes("\\(h(s,c)=c\\)"));
  assert.ok(threatCard.includes("\\(x'=(1,0)\\) has zero-one loss \\(1\\)"));
  assert.match(threatCard, /budget of one flip/u);
  assert.match(threatCard, /label-preservation assumption/u);
  assert.match(threatCard, /worst-case zero-one\s+loss/u);
  assert.match(threatCard, /not an attack implementation/u);
  assert.match(threatCard, /M36-C08 -> S36-20/u);
  assert.equal(
    (m36Workbook.match(/\*\*Answer: [A-D]\.\*\* Misconception map:/g) ?? []).length,
    6,
    "Each M36 diagnostic should link wrong answers to a repair.",
  );
  assert.match(m36Workbook, /not IID evidence, a PAC\/VC calculation/u);

  const dossierStart = m36Workbook.indexOf(
    "### Output: Statistical Learning Theory & Reliable Deep-Learning Systems Dossier",
  );
  const rubricStart = m36Workbook.indexOf("### Acceptance rubric", dossierStart);
  assert.ok(dossierStart >= 0, "M36 should define its final connected dossier");
  assert.ok(rubricStart > dossierStart, "M36 should place its rubric after the final dossier");

  const dossier = m36Workbook.slice(dossierStart, rubricStart);
  assert.match(dossier, /two declared synthetic shift mechanisms/u);
  assert.match(dossier, /input-time or delayed-label evidence/u);
  assert.match(dossier, /label\s+availability\/detection lag/u);
  assert.match(dossier, /one mechanism it can miss/u);
  assert.match(dossier, /false-alarm\/miss trade-off/u);
  assert.match(dossier, /owner, intervention, and stop boundary/u);
  assert.match(
    m36Workbook,
    /monitoring claim states its evidence timing, one blind spot, and the accountable response/u,
  );
});

test("the M35 research ledger preserves its canonical authoring-only boundary", async () => {
  const ledger = await readFile(
    "content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md",
    "utf8",
  );

  assert.match(ledger, /v3 contract state\s+of\s+`authoring-only`/u);
  assert.doesNotMatch(ledger, /v3 contract state\s+of\s+`not-started`/u);
  assert.match(ledger, /does \*\*not\*\*:?[\s\S]*unlock M35, M36, M25, or M26/u);
});

test("the M35 candidate ledger binds its Session 6 preflight to bounded official calibration", async () => {
  const ledger = await readFile(
    "content/source-maps/module35_machine_learning_representation.md",
    "utf8",
  );

  assert.match(ledger, /S35-25/u);
  assert.match(ledger, /Session 6 preflight/u);
  assert.match(ledger, /declared experiment evidence/u);
  assert.match(ledger, /C09\/S35-14/u);
  assert.match(ledger, /Rechecked 2026-08-03/u);
  assert.match(ledger, /do not establish a deployment or authority claim/u);
});

test("the M36 research ledger preserves its authoring-only, paraphrase, and consent boundaries", async () => {
  const ledger = await readFile(
    "content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md",
    "utf8",
  );

  assert.match(ledger, /v3 contract state of\s+`authoring-only`/u);
  assert.doesNotMatch(ledger, /v3 contract state of\s+`not-started`/u);
  assert.match(ledger, /Precise learner-authored\/paraphrased statement/u);
  assert.match(ledger, /Do not copy source prose/u);
  assert.match(ledger, /Notion integration is configured/u);
  assert.match(ledger, /learner has currently approved the\s+write/u);
  assert.match(ledger, /ready-to-paste local note/u);
  assert.match(ledger, /S36-18/u);
  assert.match(ledger, /S36-19/u);
  assert.match(ledger, /S36-20/u);
  assert.match(ledger, /Lecture 17: Out-of-Distribution Generalization/u);
});

test("the M35 and M36 authoring diagrams keep their declared prose alternatives", async () => {
  const sources = [
    {
      path: "content/authoring/m35_machine_learning_representation_workbook.v1.md",
      ids: ["m35-knowledge-map", "m35-evidence-chain", "m35-information-to-authority"],
    },
    {
      path: "content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
      ids: ["m36-theory-system-map", "m36-learning-claim-chain", "m36-theorem-to-system"],
    },
  ];

  for (const source of sources) {
    const workbook = await readFile(source.path, "utf8");
    const blocks = scanMermaidBlocks(workbook, { sourcePath: source.path });
    const report = validateMermaidAccessibility(blocks, { requireComplete: true });

    assert.ok(blocks.length >= 3);
    assert.equal(report.summary.completeBlocks, blocks.length);
    // The declared diagrams must all still be there; later additions may join
    // them without this test needing a new hard-coded list.
    const ids = blocks.map(({ metadata }) => metadata?.id);
    for (const declared of source.ids) {
      assert.ok(ids.includes(declared), `${source.path} lost ${declared}`);
    }
    assert.ok(blocks.every(({ metadata }) => metadata?.title.length >= 20));
    assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 80));
  }
});
