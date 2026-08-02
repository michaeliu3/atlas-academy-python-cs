import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const guideModules = [
  ["M1", "01_values_state_execution.md", "M2"],
  ["M2", "02_functions_recursion_induction.md", "M3"],
  ["M3", "03_abstraction_interfaces_adts.md", "M4"],
  ["M4", "04_logic_sets_relations_graphs_proof.md", "M5"],
  ["M5", "05_cost_models_algorithm_analysis.md", "M27"],
  ["M11", "11_algorithm_design_paradigms.md", "M12"],
  ["M12", "12_modules_apis_types_dependencies.md", "M13"],
  ["M13", "13_specifications_testing_debugging_observability.md", "M14"],
  ["M15", "15_files_serialization_packaging_delivery.md", "M16"],
  ["M16", "16_relational_data_transactions.md", "M17"],
  ["M17", "17_computer_architecture_execution_stack.md", "M28"],
  ["M18", "18_operating_systems_resource_mediation.md", "M19"],
  ["M19", "19_concurrency_parallelism.md", "M20"],
  ["M20", "20_networks_application_protocols.md", "M21"],
  ["M27", "27_discrete_mathematics_proof_counting_structures.md", "M6"],
];

test("learner evidence guides use constructive next steps without grading language", async () => {
  for (const [moduleId, filename, nextModule] of guideModules) {
    const markdown = await readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");

    assert.match(markdown, /Constructive next-step guide/u, `${moduleId} needs a constructive learner guide.`);
    assert.match(
      markdown,
      new RegExp(`continue with the ${nextModule} handoff`, "u"),
      `${moduleId} needs its canonical forward handoff.`,
    );
    assert.match(markdown, /Otherwise,/u, `${moduleId} needs a named repair route.`);
    assert.match(
      markdown,
      /not a score, grade, release approval, Core advance, or mastery declaration/u,
      `${moduleId} needs a non-promoting evidence boundary.`,
    );
    assert.doesNotMatch(markdown, /Instructor decision rule/u, `${moduleId} must not frame learner evidence as an instructor gate.`);
    assert.doesNotMatch(markdown, /Advance when/u, `${moduleId} must not use advancement wording for learner evidence.`);
    assert.doesNotMatch(markdown, /Advance only/u, `${moduleId} must not use advancement-only wording for learner evidence.`);
    assert.doesNotMatch(markdown, /You pass Module/u, `${moduleId} must not frame the route as a pass/fail result.`);

    if (moduleId === "M19") {
      assert.match(markdown, /### 13\.1 Evidence lenses/u, "M19 needs qualitative evidence lenses.");
      assert.doesNotMatch(markdown, /\|\s*\d+%\s*\|/u, "M19 must not turn evidence lenses into percentage scoring.");
    }
  }
});
