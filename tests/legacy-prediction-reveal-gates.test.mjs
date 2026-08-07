import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packs = [
  {
    path: "content/modules/11_algorithm_design_paradigms.md",
    expectedMarkers: 9,
    expectedAnswerGates: 0,
    expectedPredictionGates: 2,
  },
  {
    path: "content/modules/20_networks_application_protocols.md",
    expectedMarkers: 11,
    expectedAnswerGates: 8,
    expectedPredictionGates: 3,
  },
  {
    path: "content/modules/22_security_privacy_trust_boundaries.md",
    expectedMarkers: 10,
    expectedAnswerGates: 10,
    expectedPredictionGates: 0,
  },
  {
    path: "content/modules/23_programming_languages_interpreters.md",
    expectedMarkers: 8,
    expectedAnswerGates: 8,
    expectedPredictionGates: 0,
  },
  {
    path: "content/modules/24_cpython_performance_memory.md",
    expectedMarkers: 10,
    expectedAnswerGates: 6,
    expectedPredictionGates: 4,
  },
  {
    path: "content/modules/25_evidence_grounded_intelligent_systems.md",
    expectedMarkers: 9,
    expectedAnswerGates: 8,
    expectedPredictionGates: 1,
  },
  {
    path: "content/modules/27_discrete_mathematics_proof_counting_structures.md",
    expectedMarkers: 12,
    expectedAnswerGates: 11,
    expectedPredictionGates: 1,
  },
  {
    path: "content/modules/28_linear_algebra_numerical_stability_representation.md",
    expectedMarkers: 13,
    expectedAnswerGates: 12,
    expectedPredictionGates: 1,
  },
];

const explanationMarker =
  /^\*\*(?:Answer(?::|\*\*)|Best answer(?::|\*\*)|Reveal(?:\.|:|\*\*))/gmu;

function assertBalancedNativeDisclosure(markdown, path) {
  let depth = 0;
  for (const tag of markdown.match(/<details>|<\/details>/gu) ?? []) {
    if (tag === "<details>") depth += 1;
    else depth -= 1;
    assert.ok(depth >= 0, `${path} closes a native disclosure before opening it.`);
  }
  assert.equal(depth, 0, `${path} leaves a native disclosure unclosed.`);
}

test("affected legacy modules keep explanations behind closed native prediction gates", async () => {
  for (const {
    path,
    expectedMarkers,
    expectedAnswerGates,
    expectedPredictionGates,
  } of packs) {
    const markdown = await readFile(path, "utf8");
    const markers = markdown.match(explanationMarker) ?? [];
    const markersOutsideNativeDisclosure = markdown
      .replace(/<details>[^]*?<\/details>/gu, "")
      .match(explanationMarker) ?? [];
    const answerGates = markdown.match(
      /<summary>Reveal after recording your answer and confidence\.<\/summary>/gu,
    ) ?? [];
    const predictionGates = markdown.match(
      /<summary>Reveal after writing your prediction\.<\/summary>/gu,
    ) ?? [];

    assert.equal(markers.length, expectedMarkers, `${path} explanation count changed unexpectedly.`);
    assert.equal(answerGates.length, expectedAnswerGates, `${path} answer-gate count changed unexpectedly.`);
    assert.equal(
      predictionGates.length,
      expectedPredictionGates,
      `${path} prediction-gate count changed unexpectedly.`,
    );
    assert.deepEqual(
      markersOutsideNativeDisclosure,
      [],
      `${path} exposes an answer or session repair before the learner can reveal it.`,
    );
    assert.doesNotMatch(
      markdown,
      /<details\b[^>]*\bopen(?:\s|=|>)/u,
      `${path} must not default an explanation gate open.`,
    );
    assertBalancedNativeDisclosure(markdown, path);
  }
});
