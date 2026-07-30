import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const workflowPath = resolve(siteRoot, ".github", "workflows", "ci.yml");

test("Course CI pins every third-party action to a reviewed immutable commit", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const actionReferences = [...workflow.matchAll(/^\s*uses:\s+([^@\s]+)@([^\s#]+)\s+#\s+v[\d.]+\s*$/gmu)];
  assert.ok(actionReferences.length > 0, "Course CI declares third-party action references");
  for (const [, action, revision] of actionReferences) {
    assert.match(action, /^[a-z0-9-]+\/[a-z0-9-]+$/u);
    assert.match(revision, /^[0-9a-f]{40}$/u, `${action} uses a full commit SHA`);
  }
  assert.doesNotMatch(workflow, /^\s*uses:\s+[^@\s]+@v\d/imu);
  assert.match(workflow, /actions\/checkout@11bd71901bbe5b1630ceea73d27597364c9af683/u);
  assert.match(workflow, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/u);
  assert.match(workflow, /actions\/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065/u);
});
