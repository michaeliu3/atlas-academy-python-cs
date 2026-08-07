import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

test("M36 primary-source research remains a bounded authoring input, not a source-map or release claim", async () => {
  const [research, graph, registry, releaseInputs] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readJson("../content/course/course-graph.v2.json"),
    readJson("../content/course/contracts/module-contract-registry.v3.json"),
    readJson("../content/course/release-inputs.v1.json"),
  ]);

  assert.match(research, /^# Module 36 .*Primary-Source Research/mu);
  assert.match(research, /\*\*Status on 2026-08-02:\*\* instructor-facing, \*\*authoring-only\*\* research tied\s+to a private authoring workbook/u);
  assert.match(research, /This dossier is not a learner route, canonical\s+source map, structured module contract,/u);
  assert.match(research, /v3 contract state of\s+`authoring-only`/u);
  assert.match(research, /It must not unlock M36, M25, or M26/u);
  assert.match(research, /## Primary-source ledger and reuse boundary/u);
  assert.match(research, /## First-principles definitions and derivation aids/u);
  assert.match(research, /## Claim, assumption, derivation, and counterexample ledger/u);
  assert.match(research, /## Likely six-session source routing/u);
  assert.match(research, /## Bounded project and numerical-experiment plan/u);
  assert.match(research, /## Research gaps and release blockers this file does not close/u);
  assert.match(research, /A shared bounded\s+fixture\/test now supplies a finite-risk\/named-relation probe/u);
  assert.match(research, /neither a theorem review nor a general reliability model/u);
  assert.match(research, /A portable copied chat prompt stays local by default\./u);
  assert.match(research, /may create at most one concise,\s+privacy-bounded session note only after a substantive conversation/u);
  assert.match(research, /Notion integration is configured/u);
  assert.match(research, /learner has currently approved the\s+write/u);
  assert.match(research, /ready-to-paste local note/u);
  assert.match(research, /cannot be claimed\s+saved without direct evidence\./u);
  assert.match(research, /https:\/\/www\.cs\.cmu\.edu\/~mgormley\/courses\/10601\//u);
  assert.match(research, /https:\/\/cs229\.stanford\.edu\/materials\.html-full/u);
  assert.match(research, /Lecture 25: Differential Privacy and Statistical Query Learning/u);
  for (let number = 1; number <= 20; number += 1) {
    assert.match(research, new RegExp(`\\| S36-${String(number).padStart(2, "0")} \\|`, "u"));
  }

  const m36GraphEntry = graph.modules.find(({ id }) => id === "m36");
  const contract = registry.modules.find(({ moduleId }) => moduleId === "m36");
  assert.equal(m36GraphEntry?.sourceMap, null);
  assert.equal(m36GraphEntry?.studioId, null);
  assert.deepEqual(m36GraphEntry?.state, {
    lifecycle: "authoring-only",
    readerAccess: "hidden",
    availability: "authoring-only",
    contract: { track: "advanced-v1", state: "authoring-only" },
    release: { state: "unrecorded", recordId: null },
    privateGuidedStudy: { status: "ready", delivery: "designated-codex-chats" },
  });
  assert.equal(contract?.contractState, "authoring-only");
  assert.deepEqual([...new Set(contract?.criteria.map(({ status }) => status))].sort(), [
    "planned",
    "pointer-present",
  ]);
  assert.ok(
    releaseInputs.inputs.some(
      ({ path }) => path === "content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md",
    ),
  );
});

test("M36 Session 4 makes reproducibility-claim debugging explicit", async () => {
  const [workbook, companion, guides] = await Promise.all([
    readFile(
      new URL("../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md", import.meta.url),
      "utf8",
    ),
    readJson("../content/course/contracts/companions/m36.v1.json"),
    readJson("../content/course/module-companion-guides.v1.json"),
  ]);

  assert.match(workbook, /### Debugging probe — repair one reproducibility claim/u);
  assert.match(workbook, /m36ReductionOrderProbe\(\)/u);
  assert.match(workbook, /Repair the claim/u);
  assert.match(workbook, /same seed/u);
  assert.match(companion.teachingAssistant.repairMove, /debug/u);
  assert.match(companion.studyPartner.rehearsalMove, /debug/u);
  const m36Guide = guides.guides.find(({ moduleId }) => moduleId === "m36");
  assert.match(m36Guide.centralModel, /finite-class or PAC generalization claim/u);
  assert.match(m36Guide.traceOrDerivation, /Hoeffding-plus-union-bound/u);
  assert.doesNotMatch(m36Guide.traceOrDerivation, /regret|lower-bound/u);
});

test("M36 keeps finite-example and realizable-PAC probability spaces distinct", async () => {
  const workbookPaths = [
    "../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
    "../content/modules/36_statistical_learning_theory_reliable_deep_learning.md",
  ];
  const workbooks = await Promise.all(
    workbookPaths.map((relativePath) =>
      readFile(new URL(relativePath, import.meta.url), "utf8").then((markdown) =>
        markdown.replace(/\r\n?/gu, "\n"),
      ),
    ),
  );

  for (const workbook of workbooks) {
    assert.ok(
      workbook.includes("population distribution over complete examples \\(Z\\)"),
      "the finite-class card must type P over complete examples",
    );
    assert.ok(
      workbook.includes("S=(Z_1,\\ldots,Z_n)\\sim P^n"),
      "the finite-class card must name its IID sample law",
    );
    assert.ok(
      workbook.includes("write \\(D\\) for a\n") && workbook.includes("distribution over inputs \\(X\\)"),
      "the PAC card must distinguish its instance distribution",
    );
    assert.ok(
      workbook.includes("R_{D,c}(h)=\\Pr_{X\\sim D}"),
      "the PAC risk must use the instance distribution",
    );
    assert.ok(
      workbook.includes("X_{1:m}\\sim D^m,\\,\\rho_A"),
      "the PAC probability must type sampled inputs and learner randomness",
    );
    assert.ok(
      workbook.includes("proper-learning convention \\(A(S;\\rho_A)\\in\\mathcal H\\)"),
      "the PAC card must name its learner output convention",
    );
    assert.match(workbook, /spectrally-normalized margin-bound paper/u);
    assert.match(workbook, /b22b257ad0519d4500539da3c8bcf4dd-Paper\.pdf/u);
  }
});
