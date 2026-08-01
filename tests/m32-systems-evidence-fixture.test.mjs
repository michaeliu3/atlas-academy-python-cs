import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  M32_SYSTEMS_EVIDENCE_FIXTURE,
  m32BufferReuseTimeline,
  m32LayoutHandoffTrace,
  m32PairwiseTemporaryCard,
  m32ScalarReverseModeTrace,
} from "../lib/m32-systems-evidence-fixture.js";

function assertApproximately(actual, expected, tolerance = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test("the M32 fixture is fixed, local, and explicit about its platform boundary", () => {
  assert.equal(M32_SYSTEMS_EVIDENCE_FIXTURE.id, "m32-fixed-layout-ownership-autodiff-cards-v1");
  assert.equal(M32_SYSTEMS_EVIDENCE_FIXTURE.localOnly, true);
  assert.equal(Object.isFrozen(M32_SYSTEMS_EVIDENCE_FIXTURE), true);
  assert.equal(Object.isFrozen(M32_SYSTEMS_EVIDENCE_FIXTURE.storage), true);
  assert.match(M32_SYSTEMS_EVIDENCE_FIXTURE.truthBoundary, /do not describe a NumPy array/u);
  assert.match(M32_SYSTEMS_EVIDENCE_FIXTURE.truthBoundary, /race-freedom proof/u);
});

test("the M32 layout trace separates same shape from stride and handoff claims", () => {
  const trace = m32LayoutHandoffTrace();

  assert.equal(trace.sameShape, true);
  assert.equal(trace.sameStrides, false);
  assert.equal(trace.base.positiveContiguous, true);
  assert.equal(trace.reversedColumns.positiveContiguous, false);
  assert.equal(trace.declaredConsumerContract.acceptsBase, true);
  assert.equal(trace.declaredConsumerContract.acceptsReversedColumns, false);
  assert.deepEqual(trace.reads.base, [
    { logicalIndex: [0, 0], storageIndex: 0, value: 10 },
    { logicalIndex: [1, 2], storageIndex: 5, value: 22 },
  ]);
  assert.deepEqual(trace.reads.reversedColumns, [
    { logicalIndex: [0, 0], storageIndex: 2, value: 12 },
    { logicalIndex: [1, 2], storageIndex: 3, value: 20 },
  ]);
  assert.match(trace.conclusion, /same declared shape/u);
  assert.match(trace.truthBoundary, /CUDA\/HIP stream/u);
});

test("the M32 pairwise card distinguishes logical temporary shape from an allocation claim", () => {
  const card = m32PairwiseTemporaryCard({ n: 4, k: 3, d: 2 });

  assert.deepEqual(card.inputs, {
    pointsShape: [4, 2],
    centersShape: [3, 2],
  });
  assert.deepEqual(card.logicalDifferenceShape, [4, 3, 2]);
  assert.deepEqual(card.logicalOutputShape, [4, 3]);
  assert.equal(card.temporaryElements, 24);
  assert.equal(card.outputElements, 12);
  assert.equal(card.temporaryToOutputElementRatio, 2);
  assert.match(card.conclusion, /does not show whether a particular backend materializes/u);
  assert.throws(() => m32PairwiseTemporaryCard({ n: 0, k: 3, d: 2 }), /from 1 through 4096/u);
});

test("the M32 ownership card rejects release before the declared last consumer completes", () => {
  const tooEarly = m32BufferReuseTimeline("after-enqueue");
  const afterCopy = m32BufferReuseTimeline("after-copy-complete");
  const legal = m32BufferReuseTimeline("after-kernel-complete");

  assert.equal(tooEarly.reuseSafe, false);
  assert.equal(afterCopy.reuseSafe, false);
  assert.equal(legal.reuseSafe, true);
  assert.equal(legal.legalReleasePoint, "after-kernel-complete");
  assert.match(tooEarly.conclusion, /rejects reuse/u);
  assert.match(legal.conclusion, /permits reuse/u);
  assert.match(tooEarly.truthBoundary, /not a CUDA\/HIP\/JAX\/PyTorch execution trace/u);
  assert.throws(() => m32BufferReuseTimeline("after-return"), /release point must be one of/u);
});

test("the M32 scalar trace keeps a manual chain rule distinct from framework autodiff", () => {
  const trace = m32ScalarReverseModeTrace({ theta: 1, x: 2, y: 1 });

  assert.equal(trace.operations[0].value, 2);
  assert.equal(trace.operations[1].value, 1);
  assert.equal(trace.operations[2].value, 1);
  assert.equal(trace.analyticGradient, 4);
  assertApproximately(trace.centralDifferenceGradient, 4, 1e-8);
  assert.match(trace.conclusion, /does not validate a framework graph/u);
  assert.throws(
    () => m32ScalarReverseModeTrace({ theta: 1, x: 2, y: 1, step: 0 }),
    /step must be positive/u,
  );
});

test("the M32 workbook turns each bounded card into a prediction-before-inspection task", async () => {
  const workbook = await readFile(
    "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /m32LayoutHandoffTrace\(\)/u);
  assert.match(workbook, /m32PairwiseTemporaryCard\(\{ n: 4, k: 3, d: 2 \}\)/u);
  assert.match(workbook, /m32BufferReuseTimeline\("after-enqueue"\)/u);
  assert.match(workbook, /m32ScalarReverseModeTrace\(\{ theta: 1, x: 2, y: 1 \}\)/u);
  assert.match(workbook, /not an actual array-library, buffer-protocol, or GPU trace/u);
});
