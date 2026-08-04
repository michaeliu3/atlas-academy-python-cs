import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const moduleFiles = [
  ["m31", "m31_optimization_information_workbook.v1.md", 9],
  ["m32", "m32_systems_languages_scientific_python_accelerators_workbook.v1.md", 8],
  ["m33", "m33_formal_languages_computability_complexity_workbook.v1.md", 5],
  ["m34", "m34_classical_ai_search_constraints_decision_workbook.v1.md", 5],
  ["m35", "m35_machine_learning_representation_workbook.v1.md", 6],
  ["m36", "m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md", 6],
];

test("M31–M36 hidden packs expose a connected ladder and per-distractor repair cards", async () => {
  for (const [moduleId, filename, questionCount] of moduleFiles) {
    const workbook = await readFile(new URL(`../content/authoring/${filename}`, import.meta.url), "utf8");

    assert.match(workbook, /^## Graduated problem ladder$/mu, `${moduleId} needs a problem ladder`);
    for (let step = 1; step <= 6; step += 1) {
      assert.match(
        workbook,
        new RegExp(`^### Ladder step ${step} —`, "mu"),
        `${moduleId} needs ladder step ${step}`,
      );
    }

    const repairHeading = "### Distractor repair cards (per option)";
    const repairStart = workbook.indexOf(repairHeading);
    assert.notEqual(repairStart, -1, `${moduleId} needs per-distractor repair cards`);
    const repairSection = workbook.slice(repairStart);
    assert.match(repairSection, /\| Question \| Distractor routes \(A\/B\/C\/D\) \| Repair route \| Smallest counterexample \| Transfer prompt \|/u);

    const questionRows = [...repairSection.matchAll(/^\| Q(\d+) \|/gmu)].map((match) => Number(match[1]));
    assert.deepEqual(
      questionRows,
      Array.from({ length: questionCount }, (_, index) => index + 1),
      `${moduleId} repair cards must cover every diagnostic question in order`,
    );

    for (const question of questionRows) {
      const row = repairSection.match(new RegExp(`^\\| Q${question} \\|([^\\n]+)$`, "mu"))?.[0] ?? "";
      assert.match(row, /A:/u, `${moduleId} Q${question} names distractor A`);
      assert.match(row, /B:/u, `${moduleId} Q${question} names distractor B`);
      assert.match(row, /C:/u, `${moduleId} Q${question} names distractor C`);
      assert.match(row, /D:/u, `${moduleId} Q${question} names distractor D`);
      assert.ok(row.split("|").length >= 6, `${moduleId} Q${question} has all repair columns`);
    }
  }
});
