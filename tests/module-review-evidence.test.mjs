import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  loadModuleEvidenceRecord,
  loadModuleReviewRecord,
  readTrackedText,
  teachingTestDiscoveryKind,
  validateModuleEvidenceRecord,
  validateModuleReviewRecord,
} from "../scripts/module-review-evidence.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";

const execFileAsync = promisify(execFile);

async function writeFixture(root, relativePath, contents) {
  const absolutePath = join(root, relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, contents, "utf8");
}

async function createTrackedFixture() {
  const root = await mkdtemp(join(tmpdir(), "atlas-module-review-evidence-"));
  await execFileAsync("git", ["init", "--quiet"], { cwd: root });
  await execFileAsync("git", ["config", "user.email", "tests@example.invalid"], { cwd: root });
  await execFileAsync("git", ["config", "user.name", "Atlas test"], { cwd: root });

  await writeFixture(
    root,
    "content/modules/m01.md",
    "# Module 1\n\n## First principles\n\nA model begins with stated assumptions.\n",
  );
  await writeFixture(root, "content/source.json", '{"claims":{"state":"bounded"}}\n');
  await writeFixture(
    root,
    "package.json",
    JSON.stringify({ scripts: { "test:browser": "pnpm build && playwright test" } }, null, 2) + "\n",
  );
  await writeFixture(
    root,
    "playwright.config.ts",
    'export default { testDir: "./e2e" };\n',
  );
  await writeFixture(
    root,
    "e2e/accessibility.spec.ts",
    'test("M01 direct workbench remains keyboard-operable", async () => {});\n',
  );
  await writeFixture(
    root,
    "content/course/contracts/companions/m01.v1.json",
    '{"teachingAssistant":{"openingMove":"Start from the visible model."}}\n',
  );
  await writeFixture(root, "scripts/reference-model.mjs", "export const model = 'bounded';\n");
  await writeFixture(
    root,
    "content/reviews/m01.evidence.v1.json",
    `${JSON.stringify({
      schemaVersion: 1,
      kind: "atlas-module-evidence-record",
      recordVersion: "v1",
      moduleId: "m01",
      purpose: "Bind Module 1 review claims to local, inspectable inputs.",
      truthBoundary: {
        structuralResolution: "Resolved inputs show only that the declared local references exist.",
        humanReview: "This evidence record does not itself approve teaching quality or learner mastery.",
        release: "This evidence record does not declare a release, deployment, or security result.",
      },
      evidence: [
        {
          id: "first-principles-model",
          criterionId: "first-principles",
          claim: "The module explicitly names its starting model.",
          inputs: [
            {
              kind: "markdown-heading",
              role: "course-content",
              path: "content/modules/m01.md",
              locator: "first-principles",
            },
            {
              kind: "json-pointer",
              role: "source-ledger",
              path: "content/source.json",
              locator: "/claims/state",
            },
            {
              kind: "json-pointer",
              role: "learning-companion",
              path: "content/course/contracts/companions/m01.v1.json",
              locator: "/teachingAssistant",
            },
            {
              kind: "file",
              role: "reference-model",
              path: "scripts/reference-model.mjs",
              locator: null,
            },
          ],
          limitations: ["A reviewer must still judge whether the explanation is adequate."],
        },
      ],
    }, null, 2)}\n`,
  );
  await execFileAsync("git", ["add", "."], { cwd: root });
  await execFileAsync("git", ["commit", "--quiet", "-m", "fixture"], { cwd: root });
  return root;
}

test("a module-specific evidence record resolves tracked Markdown headings, JSON pointers, and files", async (t) => {
  const root = await createTrackedFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  const record = await loadModuleEvidenceRecord("content/reviews/m01.evidence.v1.json", {
    siteRoot: root,
  });
  const report = await validateModuleEvidenceRecord(record, { siteRoot: root });

  assert.equal(report.record.moduleId, "m01");
  assert.deepEqual(
    report.resolvedInputs.map(({ kind, path, locator }) => ({ kind, path, locator })),
    [
      {
        kind: "markdown-heading",
        path: "content/modules/m01.md",
        locator: "first-principles",
      },
      { kind: "json-pointer", path: "content/source.json", locator: "/claims/state" },
      {
        kind: "json-pointer",
        path: "content/course/contracts/companions/m01.v1.json",
        locator: "/teachingAssistant",
      },
      { kind: "file", path: "scripts/reference-model.mjs", locator: null },
    ],
  );
  assert.equal(report.resolvedInputs[0].heading.title, "First principles");
  assert.equal(report.resolvedInputs[1].value, "bounded");
  for (const input of report.resolvedInputs) {
    assert.match(input.blobOid, /^[a-f0-9]{40,64}$/u);
    assert.match(input.sha256, /^sha256:[a-f0-9]{64}$/u);
  }
  assert.deepEqual(report.releaseInputPaths, [
    "content/course/contracts/companions/m01.v1.json",
    "content/modules/m01.md",
    "content/source.json",
    "scripts/reference-model.mjs",
  ]);
  await assert.rejects(
    () =>
      validateModuleEvidenceRecord(record, {
        siteRoot: root,
        expectedModuleId: "m01",
        requiredCriterionIds: ["first-principles", "source-ledger"],
      }),
    /exactly cover requiredCriterionIds/i,
  );

  const unsupportedRole = structuredClone(record);
  unsupportedRole.evidence[0].inputs[0].role = "unbounded-claim";
  await assert.rejects(
    () => validateModuleEvidenceRecord(unsupportedRole, { siteRoot: root }),
    /allowlisted contract-input role/i,
  );

  const unscopedCompanion = structuredClone(record);
  unscopedCompanion.evidence[0].inputs[2].path = "content/source.json";
  await assert.rejects(
    () => validateModuleEvidenceRecord(unscopedCompanion, { siteRoot: root }),
    /canonical module-scoped companion JSON path/i,
  );
});

test("browser-test evidence binds a declared Playwright test to the configured browser runner", async (t) => {
  const root = await createTrackedFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  const record = await loadModuleEvidenceRecord("content/reviews/m01.evidence.v1.json", {
    siteRoot: root,
  });
  const browserBound = structuredClone(record);
  browserBound.evidence[0].inputs.push(
    {
      kind: "browser-test",
      role: "test",
      path: "e2e/accessibility.spec.ts",
      locator: "M01 direct workbench remains keyboard-operable",
    },
    {
      kind: "browser-test-runner",
      role: "test-runner",
      path: "package.json",
      locator: "/scripts/test:browser",
    },
    {
      kind: "browser-test-config",
      role: "test-runner",
      path: "playwright.config.ts",
      locator: null,
    },
  );

  const report = await validateModuleEvidenceRecord(browserBound, { siteRoot: root });
  assert.equal(teachingTestDiscoveryKind("e2e/accessibility.spec.ts"), "browser");
  assert.deepEqual(
    report.resolvedInputs
      .filter(({ path }) => path.startsWith("e2e/") || path === "package.json" || path === "playwright.config.ts")
      .map(({ kind, path, locator }) => ({ kind, path, locator })),
    [
      {
        kind: "browser-test",
        path: "e2e/accessibility.spec.ts",
        locator: "M01 direct workbench remains keyboard-operable",
      },
      {
        kind: "browser-test-runner",
        path: "package.json",
        locator: "/scripts/test:browser",
      },
      { kind: "browser-test-config", path: "playwright.config.ts", locator: null },
    ],
  );

  const wrongTitle = structuredClone(browserBound);
  wrongTitle.evidence[0].inputs.at(-3).locator = "M01 unrelated browser check";
  await assert.rejects(
    () => validateModuleEvidenceRecord(wrongTitle, { siteRoot: root }),
    /must name a declared Playwright test title/i,
  );

  const missingRunner = structuredClone(browserBound);
  missingRunner.evidence[0].inputs.splice(-2);
  await assert.rejects(
    () => validateModuleEvidenceRecord(missingRunner, { siteRoot: root }),
    /must bind exactly one browser-test-runner and one browser-test-config input/i,
  );
});

test("evidence inputs refuse a worktree file that differs from its Git index", async (t) => {
  const root = await createTrackedFixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const record = await loadModuleEvidenceRecord("content/reviews/m01.evidence.v1.json", {
    siteRoot: root,
  });
  await writeFixture(
    root,
    "content/modules/m01.md",
    "# Module 1\n\n## First principles\n\nAn unindexed replacement must not become evidence.\n",
  );

  await assert.rejects(
    () => validateModuleEvidenceRecord(record, { siteRoot: root }),
    /must resolve to a Git-tracked regular local file/i,
  );
});

test("review-candidate delivery evidence is a canonical root JSON pointer", async (t) => {
  const root = await createTrackedFixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const selectorPath = "content/course/contracts/review-candidates/m01.v1.json";
  await writeFixture(root, selectorPath, "{}\n");
  await execFileAsync("git", ["add", selectorPath], { cwd: root });
  await execFileAsync("git", ["commit", "--quiet", "-m", "selector fixture"], { cwd: root });

  const record = await loadModuleEvidenceRecord("content/reviews/m01.evidence.v1.json", {
    siteRoot: root,
  });
  const bound = structuredClone(record);
  bound.evidence[0].inputs.push({
    kind: "json-pointer",
    role: "review-candidate-delivery",
    path: selectorPath,
    locator: "",
  });
  const report = await validateModuleEvidenceRecord(bound, { siteRoot: root });
  assert.ok(report.resolvedInputs.some(({ role, path, locator }) => (
    role === "review-candidate-delivery" && path === selectorPath && locator === ""
  )));

  const nonRoot = structuredClone(bound);
  nonRoot.evidence[0].inputs.at(-1).locator = "/scope";
  await assert.rejects(
    () => validateModuleEvidenceRecord(nonRoot, { siteRoot: root }),
    /must bind the JSON-document root/i,
  );

  const authoringSubstitute = structuredClone(bound);
  authoringSubstitute.evidence[0].inputs.at(-1).path =
    "content/course/contracts/authoring-delivery/m01.v1.json";
  await assert.rejects(
    () => validateModuleEvidenceRecord(authoringSubstitute, { siteRoot: root }),
    /canonical module-scoped review-candidate JSON path/i,
  );
});

test("evidence validation fails closed if a supplied Git-index snapshot goes stale", async (t) => {
  const root = await createTrackedFixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const record = await loadModuleEvidenceRecord("content/reviews/m01.evidence.v1.json", {
    siteRoot: root,
  });
  const snapshot = await openGitIndexSnapshot(root);

  await writeFixture(
    root,
    "content/modules/m01.md",
    "# Module 1\n\n## First principles\n\nA different staged model must invalidate the old snapshot.\n",
  );
  await execFileAsync("git", ["add", "content/modules/m01.md"], { cwd: root });

  await assert.rejects(
    () => validateModuleEvidenceRecord(record, { siteRoot: root, snapshot }),
    /INDEX_SNAPSHOT_STALE/u,
  );
});

test("evidence readers reject forged and foreign Git-index snapshots", async (t) => {
  const [root, foreignRoot] = await Promise.all([createTrackedFixture(), createTrackedFixture()]);
  t.after(() => rm(root, { recursive: true, force: true }));
  t.after(() => rm(foreignRoot, { recursive: true, force: true }));

  const forgedErrors = [];
  assert.equal(
    await readTrackedText(
      root,
      "content/modules/m01.md",
      "forged snapshot fixture",
      forgedErrors,
      {
        snapshot: {
          assertClean: async () => undefined,
          readText: async () => ({ text: "forged" }),
        },
      },
    ),
    null,
  );
  assert.match(forgedErrors.join("\n"), /INVALID_SNAPSHOT/u);

  const foreignErrors = [];
  assert.equal(
    await readTrackedText(
      root,
      "content/modules/m01.md",
      "foreign snapshot fixture",
      foreignErrors,
      { snapshot: await openGitIndexSnapshot(foreignRoot) },
    ),
    null,
  );
  assert.match(foreignErrors.join("\n"), /SNAPSHOT_SITE_ROOT_MISMATCH/u);
});

test("a review record binds the exact tracked evidence digest and its criterion-level judgment", async (t) => {
  const root = await createTrackedFixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const evidencePath = "content/reviews/m01.evidence.v1.json";
  const evidenceText = await readFile(join(root, evidencePath), "utf8");
  const evidenceRecordDigest = `sha256:${createHash("sha256").update(evidenceText, "utf8").digest("hex")}`;
  const reviewPath = "content/reviews/m01.review.v1.json";
  await writeFixture(
    root,
    reviewPath,
    `${JSON.stringify({
      schemaVersion: 1,
      kind: "atlas-module-review-record",
      recordVersion: "v1",
      moduleId: "m01",
      evidenceRecordPath: evidencePath,
      evidenceRecordDigest,
      purpose: "Record a bounded human-quality review of the declared evidence.",
      truthBoundary: {
        evidenceBinding: "The review is bound to this exact evidence-record digest.",
        qualityDecision: "The decision is a reviewer judgment, not an automatic structural conclusion.",
        learnerMastery: "The review does not grade or certify a learner.",
        release: "The review does not itself declare release, deployment, or security status.",
      },
      review: {
        reviewerRole: "curriculum reviewer",
        reviewedAt: "2026-07-31",
        overallOutcome: "approved",
        summary: "The bounded evidence is ready for the next promotion decision.",
        knownLimitations: ["A separate release review is still required."],
      },
      criteria: [
        {
          criterionId: "first-principles",
          outcome: "approved",
          rationale: "The model is named and linked to inspectable local inputs.",
        },
      ],
    }, null, 2)}\n`,
  );
  await execFileAsync("git", ["add", reviewPath], { cwd: root });
  await execFileAsync("git", ["commit", "--quiet", "-m", "review fixture"], { cwd: root });

  const review = await loadModuleReviewRecord(reviewPath, { siteRoot: root });
  const report = await validateModuleReviewRecord(review, {
    siteRoot: root,
    expectedModuleId: "m01",
    expectedEvidenceRecordPath: evidencePath,
    expectedEvidenceRecordDigest: evidenceRecordDigest,
    requiredCriterionIds: ["first-principles"],
  });

  assert.equal(report.reviewByCriterion.get("first-principles")?.outcome, "approved");
  assert.deepEqual(report.summary, {
    reviewedCriteria: 1,
    approvedCriteria: 1,
    changesRequestedCriteria: 0,
  });
  assert.deepEqual(report.releaseInputPaths, [
    "content/course/contracts/companions/m01.v1.json",
    "content/modules/m01.md",
    evidencePath,
    "content/source.json",
    "scripts/reference-model.mjs",
  ]);

  await assert.rejects(
    () =>
      validateModuleReviewRecord(
        { ...review, evidenceRecordDigest: "sha256:0000000000000000000000000000000000000000000000000000000000000000" },
        { siteRoot: root },
      ),
    /must match the exact checked-in evidence record/i,
  );
});
