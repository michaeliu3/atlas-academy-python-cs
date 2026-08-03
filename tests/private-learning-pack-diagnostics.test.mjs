import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packs = [
  {
    path: "content/authoring/m31_optimization_information_workbook.v1.md",
    expectedAnswers: 9,
    minimumSessionReveals: 6,
  },
  {
    path: "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md",
    expectedAnswers: 8,
    minimumSessionReveals: 6,
  },
  {
    path: "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    expectedAnswers: 5,
    minimumSessionReveals: 6,
  },
  {
    path: "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    expectedAnswers: 5,
    minimumSessionReveals: 6,
  },
  {
    path: "content/authoring/m35_machine_learning_representation_workbook.v1.md",
    expectedAnswers: 6,
    minimumSessionReveals: 5,
  },
  {
    path: "content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
    expectedAnswers: 6,
    minimumSessionReveals: 5,
  },
];

function diagnosticSection(markdown, path) {
  const heading = /^## (?:\d+\. )?Confidence-aware diagnostic[^\n]*$/mu.exec(markdown);
  assert.ok(heading, `${path} needs a confidence-aware diagnostic heading.`);

  const start = heading.index;
  const remainder = markdown.slice(start);
  const boundary = /^---$/mu.exec(remainder.slice(heading[0].length));
  assert.ok(boundary, `${path} diagnostic needs a closing section boundary.`);

  return remainder.slice(0, heading[0].length + boundary.index);
}

test("advanced private-study packs preserve prediction gates and direct source routes", async () => {
  for (const { path, expectedAnswers, minimumSessionReveals } of packs) {
    const markdown = await readFile(path, "utf8");
    const diagnostic = diagnosticSection(markdown, path);
    const answers = diagnostic.match(/\*\*Answer:/gu) ?? [];
    const sessionReveals = markdown.match(/\*\*Reveal:\*\*/gu) ?? [];
    const summaries = diagnostic.match(
      /<summary>Reveal after recording your answer and confidence\.<\/summary>/gu,
    ) ?? [];
    const sessionSummaries = markdown.match(
      /<summary>Reveal after writing your prediction\.<\/summary>/gu,
    ) ?? [];
    const answersOutsideNativeDisclosure = diagnostic
      .replace(/<details>[^]*?<\/details>/gu, "")
      .match(/\*\*Answer:/gu) ?? [];
    const sessionRevealsOutsideNativeDisclosure = markdown
      .replace(/<details>[^]*?<\/details>/gu, "")
      .match(/\*\*Reveal:\*\*/gu) ?? [];

    assert.match(
      diagnostic,
      /(?:choose|Choose).*?(?:record|mark).*?confidence.*?before/isu,
      `${path} needs a clear prediction/confidence instruction before reveal.`,
    );
    assert.equal(answers.length, expectedAnswers, `${path} answer count changed unexpectedly.`);
    assert.equal(summaries.length, expectedAnswers, `${path} needs one native reveal gate per answer.`);
    assert.ok(
      sessionReveals.length >= minimumSessionReveals,
      `${path} needs the declared minimum number of session prediction/reveal moments.`,
    );
    assert.ok(
      sessionSummaries.length >= minimumSessionReveals,
      `${path} needs the declared minimum number of native session prediction gates.`,
    );
    assert.deepEqual(
      answersOutsideNativeDisclosure,
      [],
      `${path} exposes a diagnostic answer outside a native reveal gate.`,
    );
    assert.deepEqual(
      sessionRevealsOutsideNativeDisclosure,
      [],
      `${path} exposes a session repair outside a native prediction gate.`,
    );
    assert.doesNotMatch(
      markdown,
      /<details\b[^>]*\bopen(?:\s|=|>)/u,
      `${path} must not default a learning reveal gate open.`,
    );
    assert.match(markdown, /### Learner-facing source links/u);
    const sourceBoundary = /^## Sources?\b.*$/mu.exec(markdown);
    assert.ok(sourceBoundary, `${path} needs a source/reuse boundary before its learner links.`);
    const sourceSection = markdown.slice(sourceBoundary.index);
    assert.match(
      sourceSection,
      /\b(?:checked|rechecked|accessed)\b[\s\S]{0,280}?\b20\d{2}-\d{2}-\d{2}\b/iu,
      `${path} needs a nearby ISO-format source access/check date.`,
    );
  }
});

test("M33 distinguishes a well-formed graph fact from a total language reduction", async () => {
  const workbook = await readFile(
    "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /A well-formed-instance transformation/u);
  assert.match(workbook, /map malformed strings to\s+a fixed no-instance/u);
  assert.match(workbook, /total map runs in polynomial time/u);
});
