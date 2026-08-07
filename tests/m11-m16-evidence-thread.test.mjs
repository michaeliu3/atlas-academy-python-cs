import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function workbook(filename) {
  return readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");
}

test("M11–M16 retain one visible evidence thread without a second tracking layer", async () => {
  const [m11, m12, m13, m14, m15, m16] = await Promise.all([
    workbook("11_algorithm_design_paradigms.md"),
    workbook("12_modules_apis_types_dependencies.md"),
    workbook("13_specifications_testing_debugging_observability.md"),
    workbook("14_software_design_and_change.md"),
    workbook("15_files_serialization_packaging_delivery.md"),
    workbook("16_relational_data_transactions.md"),
  ]);

  assert.match(m11, /Optional scope boundary — proof under a model/u);
  assert.match(m11, /Keep\s+reductions, decidability, NP-completeness/u);
  assert.match(m11, /Module 33/u);

  assert.match(m12, /Carry-forward boundary card — M12 → M13/u);
  assert.match(m12, /www\/sp26\/classes\/06-abstract-data-types/u);
  assert.doesNotMatch(m12, /www\/sp25\/classes\//u);

  assert.match(m13, /M12 boundary card/u);
  assert.match(m13, /chosen contract clause,\s*regression, missing observation, and nonclaim/us);
  assert.match(m14, /change-and-rollback card/u);
  assert.match(m14, /M13\s+contract clause\/regression and missing\s+observation/u);
  assert.match(m15, /Artifact\/release receipt — M12–M15/u);
  assert.match(m15, /interpreter; build frontend\/backend;\s*installer\/resolver/us);
  assert.match(m16, /Upstream evidence chain — M12–M16/u);
  assert.match(m16, /M12 boundary card → M13\s+claim\/regression\/evidence limit/u);
});
