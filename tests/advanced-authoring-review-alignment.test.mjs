import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const moduleIds = ["m31", "m32", "m33", "m34", "m35", "m36"];
const recordBoundaryModuleIds = new Set(["m32", "m33", "m34", "m35", "m36"]);
const designatedChatRecordBoundary = /### Record boundary for designated chats[\s\S]*?exact\s+configured\s+designated\s+Teaching\s+Assistant\s+or\s+Study\s+Partner\s+chat[\s\S]*?`records\s+on`[\s\S]*?substantive\s+session[\s\S]*?at\s+most\s+one\s+concise\s+note[\s\S]*?private\s+destination\s+is\s+reachable[\s\S]*?`pause\s+records`[\s\S]*?`off-record`[\s\S]*?authorization\s+ends\s+with\s+the\s+session[\s\S]*?raw\s+transcript[\s\S]*?direct\s+evidence/u;

function recordBoundaryBlock(markdown, label) {
  const match = markdown.match(
    /### Record boundary for designated chats[\s\S]*?(?=\n### Forward handoff)/u,
  );
  assert.ok(match, `${label} must contain one record-boundary block before its forward handoff`);
  return match[0];
}

function sessionSpine(markdown, label) {
  const headings = [...markdown.matchAll(/^## Session ([1-6]) — (.+)$/gmu)].map(
    ([, number, title]) => `${number}:${title}`,
  );

  assert.deepEqual(
    headings.map((heading) => Number(heading.slice(0, 1))),
    [1, 2, 3, 4, 5, 6],
    `${label} must expose exactly the ordered six-session spine`,
  );
  return headings;
}

function sessionLaunches(markdown, label) {
  const launches = [...markdown.matchAll(
    /^## Session [1-6] — .+\n\n\*\*Launch:\*\* (.+)$/gmu,
  )].map(([, launch]) => launch);

  assert.equal(
    launches.length,
    6,
    `${label} must give the learner one concrete Study Partner launch for every session`,
  );
  return launches;
}

function assertCoreLearningAnchors(markdown, label) {
  for (const [name, pattern] of [
    ["prerequisite connection", /prerequisite/iu],
    ["confidence-aware diagnostic", /confidence-aware diagnostic/iu],
    ["spaced review", /spaced review/iu],
    ["Teaching Assistant prompt", /Teaching Assistant/u],
    ["Study Partner prompt", /Study Partner/u],
    ["supportive oral defense", /oral.defen[cs]e/iu],
    ["source boundary", /source/iu],
    ["reuse boundary", /reuse/iu],
    ["candidate/release boundary", /(?:authoring-only|hidden|candidate)/iu],
  ]) {
    assert.match(markdown, pattern, `${label} must retain its ${name}`);
  }
}

test("hidden M31-M36 authoring and review workbooks retain one aligned learning spine", async () => {
  const registryPath = resolve(
    siteRoot,
    "content/course/contracts/advanced-module-contracts.v1.json",
  );
  const registry = JSON.parse(await readFile(registryPath, "utf8"));

  for (const moduleId of moduleIds) {
    const moduleNumber = moduleId.slice(1);
    const contract = registry.modules.find((entry) => entry.moduleId === moduleId);
    assert.ok(contract, `${moduleId} must have an advanced authoring contract`);

    const workbookInput = contract.contractInputs.find(
      ({ id }) => id === `${moduleId}-authoring-workbook-draft`,
    );
    assert.ok(workbookInput, `${moduleId} must declare its authoring workbook`);

    const selectorPath = resolve(
      siteRoot,
      `content/course/contracts/review-candidates/${moduleId}.v1.json`,
    );
    const selector = JSON.parse(await readFile(selectorPath, "utf8"));
    assert.equal(selector.moduleId, moduleId);
    assert.match(selector.workbookPath, new RegExp(`^content/modules/${moduleNumber}_`, "u"));
    assert.equal(
      selector.evidenceRecordPath,
      `content/course/contracts/evidence/${moduleId}.v1.json`,
    );
    assert.ok(
      selector.sourceLedgerPaths.every((path) => path.includes(`module${moduleNumber}_`)),
      `${moduleId} review candidate source ledgers must stay module-scoped`,
    );

    const [authoringWorkbook, reviewWorkbook] = await Promise.all([
      readFile(resolve(siteRoot, workbookInput.path), "utf8"),
      readFile(resolve(siteRoot, selector.workbookPath), "utf8"),
    ]);

    assert.deepEqual(
      sessionSpine(authoringWorkbook, `${moduleId} authoring workbook`),
      sessionSpine(reviewWorkbook, `${moduleId} review workbook`),
      `${moduleId} hidden review material must retain its authoring session progression`,
    );
    assert.deepEqual(
      sessionLaunches(authoringWorkbook, `${moduleId} authoring workbook`),
      sessionLaunches(reviewWorkbook, `${moduleId} review workbook`),
      `${moduleId} authoring workbook launches must stay aligned with the frozen review candidate`,
    );
    assertCoreLearningAnchors(authoringWorkbook, `${moduleId} authoring workbook`);
    assertCoreLearningAnchors(reviewWorkbook, `${moduleId} review workbook`);
    if (recordBoundaryModuleIds.has(moduleId)) {
      assert.match(
        authoringWorkbook,
        designatedChatRecordBoundary,
        `${moduleId} authoring workbook must preserve the designated-chat record boundary`,
      );
      assert.match(
        reviewWorkbook,
        designatedChatRecordBoundary,
        `${moduleId} review workbook must preserve the designated-chat record boundary`,
      );
      assert.equal(
        recordBoundaryBlock(authoringWorkbook, `${moduleId} authoring workbook`),
        recordBoundaryBlock(reviewWorkbook, `${moduleId} review workbook`),
        `${moduleId} authoring and review workbooks must keep the same record boundary`,
      );
    }
  }
});
