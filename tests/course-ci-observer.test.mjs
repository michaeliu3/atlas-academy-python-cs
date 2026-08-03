import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadReleaseEvidencePolicy } from "../scripts/release-evidence-verifier.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const observerWorkflowPath = resolve(
  siteRoot,
  ".github",
  "workflows",
  "observe-course-ci-metadata.yml",
);
const observerActionSha = "ed597411d8f924073f98dfc5c65a23a2325f34cd";

function observerSafetyErrors(workflow) {
  const errors = [];
  const requiredFragments = [
    "name: Observe Course CI metadata",
    "on:\n  workflow_run:\n    workflows:\n      - Course CI\n    types:\n      - completed",
    "permissions:\n  actions: read",
    "github.event.workflow_run.conclusion == 'success'",
    "github.event.workflow_run.event == 'pull_request'",
    "github.event.workflow_run.repository.full_name == github.repository",
    "github.event.workflow_run.head_repository.full_name == github.repository",
    "github.event.workflow_run.head_sha != ''",
    "github.event.workflow_run.display_title == 'atlas-course-ci-gate'",
    "uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0",
    "context.payload.workflow_run.id",
    "context.payload.workflow_run.run_attempt",
    "context.payload.workflow_run.head_sha",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
    'displayTitle: "atlas-course-ci-gate"',
    "run.display_title === expected.displayTitle",
    "source-head-attached Course CI metadata observation",
  ];
  for (const fragment of requiredFragments) {
    if (!workflow.includes(fragment)) {
      errors.push(`missing required observer fragment: ${fragment}`);
    }
  }
  if (!/^permissions:\n  actions: read\n(?:\n|jobs:)/mu.test(workflow)) {
    errors.push("top-level permissions must be exactly actions: read");
  }
  if (!/^\s{4}timeout-minutes:\s*[1-5]\s*$/mu.test(workflow)) {
    errors.push("observer job must have a timeout of five minutes or less");
  }
  const actionReferences = [...workflow.matchAll(/^[ \t]*uses:\s+([^@\s]+)@([^\s#]+)\s+#\s+v[\d.]+\s*$/gmu)];
  if (actionReferences.length !== 1) {
    errors.push("observer must use exactly one pinned metadata-reading action");
  }
  for (const [, action, revision] of actionReferences) {
    if (action !== "actions/github-script" || revision !== observerActionSha) {
      errors.push("observer action must be the pinned github-script metadata reader");
    }
  }

  const forbiddenPatterns = [
    [/(?:^|\n)\s*push:/u, "push trigger"],
    [/(?:^|\n)\s*pull_request(?:_target)?:/u, "pull-request trigger"],
    [/(?:^|\n)\s*workflow_dispatch:/u, "manual trigger"],
    [/(?:^|\n)\s*repository_dispatch:/u, "repository-dispatch trigger"],
    [/(?:^|\n)\s*schedule:/u, "schedule trigger"],
    [/(?:^|\n)\s*workflow_call:/u, "workflow-call trigger"],
    [/permissions:\s*write-all/u, "write-all permission"],
    [/\b(?:contents|checks|statuses|pull-requests|packages|id-token|attestations):\s*(?:read|write)/u, "unneeded permission"],
    [/\b(?:actions):\s*write/u, "write-capable actions permission"],
    [/(?:^|\n)\s*(?:-\s*)?run:/u, "shell command"],
    [/actions\/checkout|checkout@|git\s+(?:checkout|clone|fetch)|gh\s+pr\s+checkout/iu, "checkout or Git operation"],
    [/artifact|actions\/(?:download|upload)-artifact/iu, "artifact handling"],
    [/actions\/cache|cache:|cache-dependency-path/iu, "cache handling"],
    [/setup-(?:node|python)/iu, "runtime setup action"],
    [/\b(?:container|services|defaults):/u, "container or shell-default configuration"],
    [/uses:\s*(?:docker:|[^\s]+\/\.github\/workflows\/)/u, "dynamic container or reusable workflow"],
    [/\$\{\{\s*github\.event\.workflow_run\.(?:head_branch|pull_requests|[^}]+)\s*\}\}/u, "event interpolation into script data"],
    [/\bpull_requests\b|\bhead_branch\b|\bgithub\.ref\b/u, "mutable pull-request or branch identity"],
    [/github\.rest\.[\w.]+\.(?:create|update|delete)|\b(?:POST|PUT|PATCH|DELETE)\s+\/repos\//u, "write-capable GitHub API request"],
  ];
  for (const [pattern, label] of forbiddenPatterns) {
    if (pattern.test(workflow)) {
      errors.push(`observer must not contain ${label}`);
    }
  }
  return errors;
}

function requireSafeObserver(workflow) {
  const errors = observerSafetyErrors(workflow);
  assert.deepEqual(errors, []);
}

test("the Course CI metadata observer is read-only, source-head-bound, and non-executing", async () => {
  const [workflow, releaseEvidencePolicy] = await Promise.all([
    readFile(observerWorkflowPath, "utf8"),
    loadReleaseEvidencePolicy(siteRoot),
  ]);
  requireSafeObserver(workflow);

  const { policy } = releaseEvidencePolicy;
  assert.ok(workflow.includes(`repository: \"${policy.repository}\"`));
  assert.ok(workflow.includes(`workflowId: ${policy.courseCi.workflowId}`));
  assert.ok(workflow.includes(`workflowName: \"${policy.courseCi.workflowName}\"`));
  assert.ok(workflow.includes(`workflowPath: \"${policy.courseCi.workflowPath}\"`));
  assert.ok(workflow.includes(`event: \"${policy.courseCi.event}\"`));
  const requiredJobs = workflow.match(/requiredJobNames:\s*\[([\s\S]*?)\],\n\s*\}\);/u);
  assert.ok(requiredJobs, "observer declares a bounded inline required-job list");
  assert.deepEqual(
    [...requiredJobs[1].matchAll(/"([^"]+)"/gu)].map(([, name]) => name),
    policy.courseCi.requiredJobNames,
  );
});

test("the observer static gate rejects privileged triggers, writes, and PR-code execution primitives", () => {
  const safeFixture = `name: Observe Course CI metadata
on:
  workflow_run:
    workflows:
      - Course CI
    types:
      - completed
permissions:
  actions: read
jobs:
  observe:
    if: >-
      github.event.workflow_run.conclusion == 'success' &&
      github.event.workflow_run.event == 'pull_request' &&
      github.event.workflow_run.repository.full_name == github.repository &&
      github.event.workflow_run.head_repository.full_name == github.repository &&
      github.event.workflow_run.head_sha != '' &&
      github.event.workflow_run.display_title == 'atlas-course-ci-gate'
    runs-on: ubuntu-latest
    timeout-minutes: 3
    steps:
      - name: Read metadata
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          github-token: \${{ github.token }}
          script: |
            const id = context.payload.workflow_run.id;
            const attempt = context.payload.workflow_run.run_attempt;
            const source = context.payload.workflow_run.head_sha;
            const run = await github.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}");
            const jobs = await github.paginate("GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs");
            const expected = Object.freeze({
              repository: \"michaeliu3/atlas-academy-python-cs\",
              workflowId: 323581527,
              workflowName: \"Course CI\",
              workflowPath: \".github/workflows/ci.yml\",
              displayTitle: \"atlas-course-ci-gate\",
              event: \"pull_request\",
              requiredJobNames: [\"Portal quality gate\", \"Teaching models on Python 3.12\", \"Teaching models on Python 3.14\", \"Browser accessibility acceptance\"],
            });
            assert(run.display_title === expected.displayTitle);
            core.notice("source-head-attached Course CI metadata observation");
`;
  requireSafeObserver(safeFixture);

  const unsafeCases = [
    ["checkout", safeFixture.replace("- name: Read metadata", "- uses: actions/checkout@deadbeef\n      - name: Read metadata")],
    ["cache", safeFixture.replace("steps:", "steps:\n      - uses: actions/cache@deadbeef")],
    ["artifact", safeFixture.replace("steps:", "steps:\n      - uses: actions/download-artifact@deadbeef")],
    ["shell", safeFixture.replace("steps:", "steps:\n      - run: echo unsafe")],
    ["write permission", safeFixture.replace("actions: read", "actions: write")],
    ["privileged trigger", safeFixture.replace("workflow_run:", "pull_request_target:" )],
    ["missing head guard", safeFixture.replace("      github.event.workflow_run.head_sha != '' &&\n", "")],
  ];
  for (const [label, unsafeFixture] of unsafeCases) {
    assert.ok(observerSafetyErrors(unsafeFixture).length > 0, `${label} is rejected`);
  }
});
