import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const matrix = JSON.parse(
  await readFile(
    new URL("../content/course/goal-compliance.v1.json", import.meta.url),
    "utf8",
  ),
);
const audit = await readFile(
  new URL("../docs/FINAL_AUDIT.md", import.meta.url),
  "utf8",
);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

test("the final audit reconciles every generated matrix requirement", () => {
  assert.match(
    audit,
    /^# Final goal audit — current status: COMPLETE \(NARROWED CONTENT\/INFRASTRUCTURE SCOPE\)$/mu,
  );
  assert.match(audit, /^## Requirement-matrix reconciliation$/mu);
  assert.match(audit, /^## Complete evidence in this audit$/mu);
  assert.match(audit, /^## Intentionally deferred by design$/mu);
  assert.match(audit, /^## Uncertain or unverified$/mu);
  assert.match(audit, /^## Required closure sequence$/mu);

  for (const requirement of matrix.requirements) {
    const id = escapeRegExp(requirement.id);
    assert.match(
      audit,
      new RegExp(`^\\|\\s*${id}\\s*\\|\\s*${escapeRegExp(requirement.state)}\\s*\\|`, "mu"),
      `${requirement.id} must retain the generated state ${requirement.state}`,
    );
  }
});
