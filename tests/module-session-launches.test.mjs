import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  extractSessionLaunches,
  stripDocumentTitle,
} from "../lib/heading-ids.js";

async function workbook(filename) {
  return stripDocumentTitle(
    await readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8"),
  );
}

test("the reader can derive a concise six-session path from M1-M10 workbooks", async () => {
  const files = [
    "01_values_state_execution.md",
    "02_functions_recursion_induction.md",
    "03_abstraction_interfaces_adts.md",
    "04_logic_sets_relations_graphs_proof.md",
    "05_cost_models_algorithm_analysis.md",
    "06_representation_memory_sequences_linked.md",
    "07_stacks_queues_iteration_lazy.md",
    "08_hashing_dictionaries_sets_indexing.md",
    "09_trees_heaps_sorting_ordered.md",
    "10_graph_algorithms_network_models.md",
  ];

  for (const file of files) {
    const markdown = await workbook(file);
    const launches = extractSessionLaunches(markdown);
    assert.equal(launches.length, 6, `${file} needs its six core sessions.`);
    const authoredOutputs = [...markdown.matchAll(
      /^### Output:\s*(.+?)\s*#*\s*$/gmu,
    )].map(([, output]) => output.trim());
    assert.equal(authoredOutputs.length, 6, `${file} needs six generic output artifacts.`);
    assert.deepEqual(
      launches.map(({ number }) => number),
      [1, 2, 3, 4, 5, 6],
      `${file} must preserve the ordered core sequence.`,
    );
    assert.deepEqual(
      launches.map(({ output }) => output),
      authoredOutputs,
      `${file} should preserve its generic Output artifact titles.`,
    );
    for (const launch of launches) {
      assert.match(launch.id, /^session-[1-6]-/u, `${file} needs a rendered session anchor.`);
      assert.ok(launch.title.length > 0, `${file} needs a readable session title.`);
      assert.ok(launch.output, `${file} needs a visible carry-forward artifact.`);
    }
  }
});

test("the reader preserves Session N output artifacts in the legacy systems bridge", async () => {
  const files = [
    "11_algorithm_design_paradigms.md",
    "12_modules_apis_types_dependencies.md",
    "14_software_design_and_change.md",
    "15_files_serialization_packaging_delivery.md",
    "16_relational_data_transactions.md",
    "17_computer_architecture_execution_stack.md",
    "18_operating_systems_resource_mediation.md",
  ];

  for (const file of files) {
    const markdown = await workbook(file);
    const launches = extractSessionLaunches(markdown);
    assert.equal(launches.length, 6, `${file} needs its six connected sessions.`);
    const authoredOutputs = [...markdown.matchAll(
      /^### Session ([1-6]) output —\s*(.+?)\s*#*\s*$/gmu,
    )].map(([, number, output]) => [Number(number), output.trim()]);
    assert.equal(authoredOutputs.length, 6, `${file} needs six explicit session artifacts.`);
    for (const session of launches) {
      assert.ok(
        session.output,
        `${file} Session ${session.number} needs its authored carry-forward artifact.`,
      );
    }
    assert.deepEqual(
      launches.map(({ number, output }) => [number, output]),
      authoredOutputs,
      `${file} should prefer its explicit Session N output artifact.`,
    );
  }
});

test("the launch extractor ignores M3's optional seventh session", async () => {
  const launches = extractSessionLaunches(await workbook("03_abstraction_interfaces_adts.md"));
  assert.equal(launches.at(-1)?.number, 6);
  assert.equal(launches.some(({ title }) => /optional/i.test(title)), false);
});

test("the hidden advanced review candidates expose a concise six-session launch spine", async () => {
  const files = [
    "31_optimization_information.md",
    "32_systems_languages_scientific_python_accelerators.md",
    "33_formal_languages_computability_complexity.md",
    "34_classical_ai_search_constraints_decision.md",
    "35_machine_learning_representation.md",
    "36_statistical_learning_theory_reliable_deep_learning.md",
  ];

  for (const file of files) {
    const launches = extractSessionLaunches(await workbook(file));
    assert.equal(launches.length, 6, `${file} needs exactly six core sessions.`);
    assert.deepEqual(
      launches.map(({ number }) => number),
      [1, 2, 3, 4, 5, 6],
      `${file} needs the canonical session order.`,
    );
    for (const session of launches) {
      assert.ok(session.launch, `${file} Session ${session.number} needs a concise launch.`);
      assert.ok(session.output, `${file} Session ${session.number} needs a carry-forward output.`);
    }
  }
});

test("the reader integrates the path before the workbook and preserves TA timing", async () => {
  const [page, interaction] = await Promise.all([
    readFile(new URL("../app/modules/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/modules/[slug]/ModuleInteraction.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /extractSessionLaunches\(lessonMarkdown\)/u);
  assert.match(page, /sessionLaunches=\{sessionLaunches\}/u);
  assert.match(interaction, /Start Session 1 with the Study Partner/u);
  assert.match(interaction, /oral defense for after Session 6 and a\s+concrete dossier/u);
});
