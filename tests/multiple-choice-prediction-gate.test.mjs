import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { isMultipleChoiceAnswerRationaleSummary } from "../lib/multiple-choice-prediction-gate.js";

const ANSWER_CONFIDENCE_LABEL =
  "Reveal after recording your answer and confidence.";

test("identifies only established multiple-choice answer-rationale summary labels", () => {
  for (const label of [
    "Answer and distractor rationales",
    "Answer and diagnostic rationales",
    "Answer, misconception analysis, and repair",
    "Answer and repair",
    "Reveal answer and reasoning",
    "Reveal answer, rationales, and routing",
    ANSWER_CONFIDENCE_LABEL,
  ]) {
    assert.equal(isMultipleChoiceAnswerRationaleSummary(label), true, label);
  }

  for (const label of [
    "Retrieval answers and routing",
    "Reveal after writing your prediction.",
    "Reveal after recording your prediction and confidence",
    "Reveal only after committing a prediction",
    "Reveal the model boundary",
    "Reveal after recording your answer and confidence",
    "Answer this retrieval prompt",
    "Reveal answerable alternatives",
    null,
    42,
  ]) {
    assert.equal(isMultipleChoiceAnswerRationaleSummary(label), false, String(label));
  }
});

test("legacy-open workbooks retain their known multiple-choice answer-rationale summaries", async () => {
  const graph = JSON.parse(
    await readFile(new URL("../content/course/course-graph.v2.json", import.meta.url), "utf8"),
  );
  const legacyOpenModules = graph.modules.filter(
    (module) => module.state.availability === "legacy-open",
  );
  const moduleFiles = await readdir(new URL("../content/modules/", import.meta.url));
  const observedByModuleNumber = new Map();

  for (const courseModule of legacyOpenModules) {
    const prefix = `${String(courseModule.number).padStart(2, "0")}_`;
    const workbook = moduleFiles.find(
      (file) => file.startsWith(prefix) && file.endsWith(".md"),
    );
    assert.ok(
      workbook,
      `M${courseModule.number} needs its canonical legacy workbook.`,
    );

    const markdown = await readFile(
      new URL(`../content/modules/${workbook}`, import.meta.url),
      "utf8",
    );
    const labels = [...markdown.matchAll(/<summary>([\s\S]*?)<\/summary>/gu)]
      .map((match) => match[1].replace(/\s+/gu, " ").trim())
      .filter(isMultipleChoiceAnswerRationaleSummary);
    if (labels.length > 0) {
      const labelsToCount = {};
      for (const label of labels) {
        labelsToCount[label] = (labelsToCount[label] ?? 0) + 1;
      }
      observedByModuleNumber.set(courseModule.number, labelsToCount);
    }
  }

  assert.deepEqual([...observedByModuleNumber], [
    [1, { "Answer and distractor rationales": 8 }],
    [2, { "Answer and distractor rationales": 8 }],
    [3, { "Answer and diagnostic rationales": 8 }],
    [4, { "Reveal answer and reasoning": 10 }],
    [5, { "Reveal answer and reasoning": 8 }],
    [6, { "Reveal answer and distractor analysis": 8 }],
    [7, { "Answer and distractor diagnosis": 8 }],
    [8, { "Reveal answer, rationales, and connection": 8 }],
    [9, { "Reveal answer, distractor analysis, and routing": 8 }],
    [10, { "Reveal answer, rationales, and routing": 8 }],
    [11, { "Answer and distractor diagnosis": 8 }],
    [12, { "Answer and misconception analysis": 8 }],
    [13, { "Answer, distractors, routing, connection": 8 }],
    [14, { "Reveal answer and misconception routes": 8 }],
    [15, { "Answer, misconception analysis, and repair": 8 }],
    [16, { "Answer, distractor diagnosis, and route": 8 }],
    [17, { "Answer, distractor diagnosis, and route": 8 }],
    [18, { "Answer, distractor diagnosis, and routing": 8 }],
    [20, { [ANSWER_CONFIDENCE_LABEL]: 8 }],
    [21, { "Answer and repair": 8 }],
    [22, { [ANSWER_CONFIDENCE_LABEL]: 10 }],
    [23, { [ANSWER_CONFIDENCE_LABEL]: 8 }],
    [24, { [ANSWER_CONFIDENCE_LABEL]: 6 }],
    [27, { [ANSWER_CONFIDENCE_LABEL]: 11 }],
    [28, { [ANSWER_CONFIDENCE_LABEL]: 12 }],
  ]);
});
