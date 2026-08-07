import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const paths = {
  m35: new URL(
    "../content/authoring/m35_machine_learning_representation_workbook.v1.md",
    import.meta.url,
  ),
  m36: new URL(
    "../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
    import.meta.url,
  ),
  m35Source: new URL(
    "../content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md",
    import.meta.url,
  ),
  m36Source: new URL(
    "../content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md",
    import.meta.url,
  ),
};

test("M35/M36 authoring packs expose the connected learning-theory breadth spine", async () => {
  const [m35, m36, m35Source, m36Source] = await Promise.all(
    Object.values(paths).map((path) => readFile(path, "utf8")),
  );

  assert.match(m35, /bias–variance/iu);
  assert.match(m35, /\\sigma\^2_\\epsilon/u);
  assert.match(m35, /Kernel\/SVM reading card/u);
  assert.match(m35, /Boosting reading card/u);
  assert.match(m35, /Ranking and ablation are evidence designs/u);
  assert.match(m35, /Problem ladder/u);
  assert.match(m35Source, /S35-27/u);
  assert.match(m35Source, /S35-28/u);

  for (const topic of [
    "VC dimension",
    "Rademacher complexity",
    "Algorithmic stability",
    "Margin bounds",
    "Online regret",
    "Bandit feedback",
  ]) {
    assert.match(m36, new RegExp(topic, "u"));
  }
  assert.match(m36, /bias–variance bridge/u);
  assert.match(m36, /Problem ladder/u);
  assert.match(m36Source, /learning-theory breadth closure/u);
  assert.match(m36Source, /Extension 3/u);
  assert.match(m35Source, /model-family breadth closure/u);
  assert.match(m35Source, /S35-27/u);
  assert.match(m35Source, /S35-28/u);
});
