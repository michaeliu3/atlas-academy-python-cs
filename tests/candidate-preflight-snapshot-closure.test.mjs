import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  loadM31AuthoringStateContextFromSnapshot,
} from "../scripts/module-evidence-preflight.mjs";
import {
  promotionEvidenceTestErrors,
  promotionLearningCompanionErrors,
  promotionVisualAlternativeErrors,
} from "../scripts/module-contract-registry.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const sourceSiteRoot = resolve(testDirectory, "..");

async function git(root, args) {
  return execFileAsync("git", args, { cwd: root, encoding: "utf8" });
}

async function writeFixture(root, repositoryPath, contents) {
  const target = join(root, repositoryPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

async function createRepository(prefix) {
  const root = await mkdtemp(join(tmpdir(), prefix));
  await git(root, ["init", "--quiet"]);
  await git(root, ["config", "user.email", "tests@example.invalid"]);
  await git(root, ["config", "user.name", "Atlas test"]);
  return root;
}

async function commitFixture(root) {
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "fixture"]);
}

function interactionEvidence(modelPath, testPath, workbookPath) {
  return {
    evidenceByCriterion: new Map([
      [
        "interaction-reference-model-and-teaching-tests",
        {
          criterionId: "interaction-reference-model-and-teaching-tests",
          resolvedInputs: [
            { kind: "file", role: "reference-model", path: modelPath },
            { kind: "file", role: "test", path: testPath },
            { kind: "markdown-heading", role: "course-content", path: workbookPath },
          ],
        },
      ],
    ]),
  };
}

function learningCompanionEvidence(companionPath) {
  return {
    evidenceByCriterion: new Map([
      [
        "ta-prompt",
        {
          criterionId: "ta-prompt",
          resolvedInputs: [
            { kind: "json-pointer", role: "learning-companion", path: companionPath, locator: "/teachingAssistant" },
          ],
        },
      ],
      [
        "study-partner-prompt",
        {
          criterionId: "study-partner-prompt",
          resolvedInputs: [
            { kind: "json-pointer", role: "learning-companion", path: companionPath, locator: "/studyPartner" },
          ],
        },
      ],
      [
        "forward-handoff",
        {
          criterionId: "forward-handoff",
          resolvedInputs: [
            { kind: "json-pointer", role: "learning-companion", path: companionPath, locator: "/forwardHandoff" },
          ],
        },
      ],
    ]),
  };
}

test("candidate helper checks keep test and visual reads on the captured index generation", async (t) => {
  const root = await createRepository("atlas-candidate-snapshot-");
  t.after(() => rm(root, { recursive: true, force: true }));
  const workbookPath = "content/authoring/m31_candidate.md";
  const modelPath = "lib/m31-optimization-authoring-model.js";
  const testPath = "tests/m31-optimization-authoring-model.test.mjs";

  await writeFixture(
    root,
    workbookPath,
    `# M31 draft

\`\`\`mermaid
%% atlas-diagram-id: m31-snapshot-route
%% atlas-diagram-title: Initial M31 candidate route
%% atlas-diagram-alt: The initial authoring route names an objective before a bounded trace and limited recommendation.
flowchart LR
  A["Objective"] --> B["Trace"]
\`\`\`
`,
  );
  await writeFixture(root, modelPath, "export const m31Model = 'initial';\n");
  await writeFixture(
    root,
    testPath,
    "import { m31Model } from '../lib/m31-optimization-authoring-model.js';\n// M31 checks m31-optimization-authoring-model.\nvoid m31Model;\n",
  );
  await writeFixture(root, "scripts/run-course-tests.mjs", "filename.endsWith(\".test.mjs\");\n");
  await commitFixture(root);

  const snapshot = await openGitIndexSnapshot(root);
  await writeFixture(root, modelPath, "export const m31Model = 'later';\n");
  await writeFixture(
    root,
    testPath,
    "import { m31Model } from '../lib/m31-optimization-authoring-model.js';\n// M31 later checks m31-optimization-authoring-model.\nvoid m31Model;\n",
  );
  await writeFixture(
    root,
    workbookPath,
    `# M31 later draft

\`\`\`mermaid
%% atlas-diagram-id: m31-snapshot-route-later
%% atlas-diagram-title: Later M31 candidate route
%% atlas-diagram-alt: The later authoring route names a changed objective before a trace and limited recommendation.
flowchart LR
  A["Changed objective"] --> B["Trace"]
\`\`\`
`,
  );
  await git(root, ["add", workbookPath, modelPath, testPath]);

  const moduleEntry = { moduleId: "m31" };
  const graphModule = { number: 31, slug: "31-optimization-information", studioId: null };
  const testErrors = await promotionEvidenceTestErrors({
    siteRoot: root,
    moduleEntry,
    graphModule,
    evidenceReport: interactionEvidence(modelPath, testPath, workbookPath),
    snapshot,
  });
  assert.match(testErrors.join("\n"), /INDEX_SNAPSHOT_STALE/u);

  const visual = await promotionVisualAlternativeErrors({
    siteRoot: root,
    moduleEntry,
    graphModule,
    manifestById: new Map(),
    evidenceReport: {
      evidenceByCriterion: new Map([
        [
          "accessible-visual-text-alternative",
          {
            criterionId: "accessible-visual-text-alternative",
            resolvedInputs: [
              { kind: "markdown-heading", role: "course-content", path: workbookPath },
            ],
          },
        ],
      ]),
    },
    snapshot,
  });
  assert.match(visual.errors.join("\n"), /INDEX_SNAPSHOT_STALE/u);
});

test("M31 state context rejects a later staged graph generation", async (t) => {
  const root = await createRepository("atlas-m31-state-context-");
  t.after(() => rm(root, { recursive: true, force: true }));
  const contextPaths = [
    "content/course/course-graph.v2.json",
    "content/course/contracts/module-contract-registry.v3.json",
    "content/modules/manifest.json",
  ];
  for (const repositoryPath of contextPaths) {
    await writeFixture(
      root,
      repositoryPath,
      await readFile(resolve(sourceSiteRoot, repositoryPath), "utf8"),
    );
  }
  await commitFixture(root);

  const snapshot = await openGitIndexSnapshot(root);
  const graphPath = join(root, "content/course/course-graph.v2.json");
  const graph = JSON.parse(await readFile(graphPath, "utf8"));
  graph.modules.find(({ id }) => id === "m31").state.readerAccess = "full";
  await writeFile(graphPath, `${JSON.stringify(graph, null, 2)}\n`, "utf8");
  await git(root, ["add", "content/course/course-graph.v2.json"]);

  const errors = [];
  const context = await loadM31AuthoringStateContextFromSnapshot(root, snapshot, errors);
  assert.equal(context, null);
  assert.match(errors.join("\n"), /INDEX_SNAPSHOT_STALE/u);
});

test("candidate companion checks keep the shared guide on the captured index generation", async (t) => {
  const root = await createRepository("atlas-candidate-companion-snapshot-");
  t.after(() => rm(root, { recursive: true, force: true }));
  const guidePath = "content/course/module-companion-guides.v1.json";
  const companionPath = "content/course/contracts/companions/m31.v1.json";
  await writeFixture(root, guidePath, await readFile(resolve(sourceSiteRoot, guidePath), "utf8"));
  await writeFixture(root, companionPath, await readFile(resolve(sourceSiteRoot, companionPath), "utf8"));
  await commitFixture(root);

  const snapshot = await openGitIndexSnapshot(root);
  const laterGuideRegistry = JSON.parse(await readFile(join(root, guidePath), "utf8"));
  laterGuideRegistry.guides[30].centralModel = "a later guide must not be mixed with a captured candidate";
  await writeFile(join(root, guidePath), `${JSON.stringify(laterGuideRegistry, null, 2)}\n`, "utf8");
  await git(root, ["add", guidePath]);

  const graph = JSON.parse(
    await readFile(resolve(sourceSiteRoot, "content/course/course-graph.v2.json"), "utf8"),
  );
  const errors = await promotionLearningCompanionErrors({
    siteRoot: root,
    moduleEntry: { moduleId: "m31" },
    graph,
    evidenceReport: learningCompanionEvidence(companionPath),
    snapshot,
  });
  assert.match(errors.join("\n"), /INDEX_SNAPSHOT_STALE/u);
});
