import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

test("M27 and M28 make the six-session core trace and delayed optional depth visible", async () => {
  const [m27, m28] = await Promise.all([
    read("../content/modules/27_discrete_mathematics_proof_counting_structures.md"),
    read("../content/modules/28_linear_algebra_numerical_stability_representation.md"),
  ]);

  for (const [label, workbook] of [["M27", m27], ["M28", m28]]) {
    const paceGuard = workbook.split("### Pace guard: one spine, optional depth")[1]?.split("\n---")[0] ?? "";
    assert.match(paceGuard, /Session \| Core trace/u, `${label} needs a visible pace guard.`);
    assert.match(
      paceGuard,
      /optional detail|optional depth|second pass/u,
      `${label} must frame deepening as a delayed second pass.`,
    );
    assert.equal(
      (paceGuard.match(/^\| [1-6] \|/gmu) ?? []).length,
      6,
      `${label} needs exactly six core-session pacing rows.`,
    );
  }

  assert.match(m27, /definition, assumption, counterexample, or proof obligation/u);
  assert.match(m28, /norm, hypothesis, coordinate convention, or error model/u);
});

test("reader and route keep focused-study bands distinct from reference reading and mastery", async () => {
  const [reader, route] = await Promise.all([
    read("../app/modules/[slug]/page.tsx"),
    read("../app/route/page.tsx"),
  ]);

  assert.match(reader, /reference read/u);
  assert.match(reader, /minimum evidence/u);
  assert.match(reader, /deep dossier/u);
  assert.match(reader, /not reading time, a promise of mastery/u);
  assert.match(route, /Evidence/u);
  assert.match(route, /focusedStudyMinutes\.minimumEvidence/u);
  assert.match(route, /focusedStudyMinutes\.deepDossier/u);
});
